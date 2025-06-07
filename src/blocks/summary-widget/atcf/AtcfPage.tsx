/*!
 * Renders the Automatic Tropical Cyclone Forecast (ATCF) data from the summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context, Devvit, useState} from "@devvit/public-api";
import {AtcfData} from "../../../../shared/dtos/redis/summary-api/SummaryApiAtcfDtos.js";
import {NoDetails} from "../common/NoDetails.js";
import {Container} from "../common/Container.js";
import {formatDate} from "../../../../shared/render/formatDate.js";

// Helper method to get the hurricane category from wind strength
const windCategory = (susWind: number | null): string | null => {
    if (susWind == null) return null;
    if (susWind >= 137) return 'CAT5';
    if (susWind >= 113) return 'CAT4';
    if (susWind >= 96) return 'CAT3';
    if (susWind >= 83) return 'CAT2';
    if (susWind >= 64) return 'CAT1';
    if (susWind >= 34) return 'TS';
    return 'TD';
};

// Helper method for rendering the ATCF date
const getDate = (s: string | null): string => {
    if (!s) return '';
    const d = new Date(s);
    const p = (v: number): string => v.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}-${p(d.getUTCMonth()+1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}z`;
};

// Renders the details of a specific ATCF storm
interface AtcfStormProps {
    context: Context;
    storm: AtcfData;
    activeStorm: string;
    setActiveStorm: ((id: string) => void) | undefined;
}

const AtcfStormWidget = (props: AtcfStormProps) => {
    // Get forecast data
    const atcf = props.storm;
    const c = atcf?.data[0];
    if (!c) return null;

    // Helper print method if value is defined
    const p =
        (pre: string | null, val: number | string | null | undefined, post: string | null = null): string => {
            return val && (typeof val === "string" || val >= 0) ? `${pre || ''}${val}${post || ''}` : '';
        };

    // Helper print method if condition is true
    const pRow =
        (printIf: number | string | null | undefined, name: string, value: string) => {
            if (!printIf) return null;
            return (
                <hstack gap="small"><text weight="bold">{name}:</text><text>{value}</text></hstack>
            );
        };

    // Create the storm ID (Basin + Storm Number) (e.g. AL3)
    const id = `${c.basin}${c.stormNo}`;

    // Get the category strength of the storm
    const windCat = windCategory(c.maxSusWind);

    // Create title / name of storm
    const name = `${c.name === 'INVEST' && atcf.invest
        ? `Invest ${c.basin}${atcf.invest.to.id}`
        : `${c.basin} ${c.level} ${c.name}`
    }${p(' - ', windCat != 'TD' ? windCat : null)}`;

    // Force values for position, so toFixed can easily be called.
    const lat = c.lat ?? 0;
    const lon = c.lon ?? 0;

    // TypeScript doesn't like props.setActive used below, because it is technically mutable
    const setActiveStorm = props.setActiveStorm;

    return (
        <vstack width="100%">
            <spacer size="small" />
            <Container onPress={setActiveStorm !== undefined ? () => setActiveStorm(props.activeStorm === id ? '' : id) : undefined}>
                {/* In the case there are multiple storms, allow the storm name to be tapped to collapse and allow other storm details to be visible. */}
                <hstack>
                    <text style="heading">{name}</text>
                </hstack>
                {/* Only render the storm details if chosen as the active storm. */}
                {id === props.activeStorm && (
                    <vstack width="100%">
                        <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white" />
                        <spacer size="small" />
                        {pRow(c.date, 'Updated', getDate(c.date))}
                        {pRow(c.lat, 'Pos', `${lat.toFixed(1)}${lat > 0 ? 'N' : 'S'} ${lon.toFixed(1)}${lon > 0 ? 'E' : 'W'}`)}
                        {pRow(c.maxSusWind, 'Wind', `${c.maxSusWind}kt${p(' / ', c.windGust, 'kt')}${p(' @ ', c.maxWindRad, 'nmi')}`)}
                        {pRow(c.minSeaLevelPsur, 'Psur', `${c.minSeaLevelPsur}mb${p(' - ', c.outerPsur, 'mb')}${p(' @ ', c.outerRad, 'nmi')}`)}
                        {pRow(c.depth, 'Depth', `${c.depth}`)}
                        {pRow(c.windRad?.rad, 'Wind Radi', `${c.windRad?.rad}NM`)}
                        {c.windRad?.rad ? (
                            <vstack>
                                <text>{c.windRad.nw?.toString().padStart(3, ' ') ?? '  0'}kt ------ {c.windRad.ne?.toString().padStart(3, ' ') ?? '  0'}kt</text>
                                <text>{c.eyeDia?.toString().padStart(12, '\xa0') ?? '  0'}NM</text>
                                <text>{c.windRad.sw?.toString().padStart(3, ' ') ?? '  0'}kt ------ {c.windRad.se?.toString().padStart(3, ' ') ?? '  0'}kt</text>
                            </vstack>
                        ) : null}
                    </vstack>
                )}
            </Container>
        </vstack>
    );
};

interface AtcfPageProps {
    context: Context;
    lastModified: number | null | undefined;
    atcf: AtcfData[] | undefined;
}

export const AtcfPage = (props: AtcfPageProps) => {
    // Get dimensions from context
    const widgetWidth = props.context.dimensions?.width ?? 288;

    // Display general message if ATCF data is missing / failed to load
    if (!props.atcf) {
        return (
            <vstack>
                <spacer size="medium" />
                <NoDetails>
                    Failed to load Automatic Tropical Cyclone Forecast. Try again later.
                </NoDetails>
            </vstack>
        );
    }

    // Allow storms to be collapsed if there are more than 1. Expand the first one if the only storm.
    const multiStorm = props.atcf.length > 1;
    const [activeStorm, setActiveStorm] = useState<string>(props.atcf.length == 1 && props.atcf[0].data.length > 0
        ? `${props.atcf[0].data[0].basin}${props.atcf[0].data[0].stormNo}`
        : '');

    // Generate storm list
    const atcfStorms = props.atcf.map(s =>
        <AtcfStormWidget
            activeStorm={activeStorm}
            setActiveStorm={multiStorm ? setActiveStorm : undefined}
            context={props.context}
            storm={s} />
    );

    return (
        <vstack width="100%">
            <Container alignment="middle center">
                <text weight="bold" size="medium">
                    {widgetWidth < 500 ?
                        'Auto Trop Cyclone Forecast (ATCF)' :
                        'Automatic Tropical Cyclone Forecast (ATCF)'
                    }
                </text>
                <text size="small">{formatDate(props.lastModified)}</text>
                {/* Temporarily remove webview note, until webview is added */}
                {/*<text size="xsmall">Open Details</text>*/}
            </Container>
            {atcfStorms && atcfStorms.length > 0
                ? atcfStorms
                : <NoDetails height="200px">No storms currently being tracked.</NoDetails>
            }
        </vstack>
    );
};