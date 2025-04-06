/*!
 * Renders the Automatic Tropical Cyclone Forecast (ATCF) data from the summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context, Devvit} from "@devvit/public-api";
import {AtcfData} from "../SummaryApi.js";

interface AtcfPageProps {
    context: Context;
    atcf: AtcfData[] | undefined;
}


interface AtcfStormProps {
    context: Context;
    storm: AtcfData;
}

const windCategory = (susWind: number | null): string | null => {
    if (susWind == null) return null;
    if (susWind >= 137) return 'CAT5';
    if (susWind >= 113) return 'CAT4';
    if (susWind >= 96) return 'CAT3';
    if (susWind >= 83) return 'CAT2';
    if (susWind >= 64) return 'CAT1';
    if (susWind >= 34) return 'TS';
    return 'TD';
}

const getDate = (s: string | null): string => {
    if (!s) return '';
    const d = new Date(s);
    const p = (v: number): string => v.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}-${p(d.getUTCMonth()+1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}z`;
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
    const pRow =
        (printIf: number | string | null | undefined, name: string, value: string) => {
            if (!printIf) return null;
            return (
                <hstack gap="small"><text weight="bold">{name}:</text><text>{value}</text></hstack>
            );
        };

    const windCat = windCategory(c.maxSusWind);
    const name = `${c.name === 'INVEST' && atcf.invest
        ? `Invest ${c.basin}${atcf.invest.to.id}`
        : `${c.basin} ${c.level} ${c.name}`
    }${p(' - ', windCat != 'TD' ? windCat : null)}`;
    const colorScheme = 'PureGray';

    return (
        <vstack>
            <spacer size="xsmall" />
            <vstack
                padding="small"
                border="thin"
                cornerRadius="small"
                lightBackgroundColor={colorScheme+'-100'}
                darkBackgroundColor={colorScheme+'-800'}
                lightBorderColor={colorScheme+'-300'}
                darkBorderColor={colorScheme+'-600'}
            >
                <text style="heading">{name}</text>
                {pRow(c.lon, 'Pos', `${c.lat?.toFixed(1) ?? 0} ${c.lon?.toFixed(1) ?? 0}`)}
                {pRow(c.maxSusWind, 'Wind', `${c.maxSusWind}kt${p(' / ', c.windGust, 'kt')}${p(' @ ', c.maxWindRad, 'nmi')}`)}
                {pRow(c.minSeaLevelPsur, 'Psur', `${c.minSeaLevelPsur}mb${p(' - ', c.outerPsur, 'mb')}${p(' @ ', c.outerRad, 'nmi')}`)}
                {pRow(c.depth, 'Depth', `${c.depth}`)}
                {pRow(c.windRad?.rad, 'Wind Radi', `${c.windRad?.rad}NM`)}
                {c.windRad?.rad ? (
                    <vstack>
                        <text>{c.windRad.nw?.toString().padStart(3, ' ') ?? '  0'}kt ------ ${c.windRad.ne?.toString().padStart(3, ' ') ?? '  0'}kt</text>
                        <text>{c.eyeDia?.toString().padStart(10, '&nbsp;') ?? '  0'}NM</text>
                        <text>{c.windRad.sw?.toString().padStart(3, ' ') ?? '  0'}kt ------ ${c.windRad.se?.toString().padStart(3, ' ') ?? '  0'}kt</text>
                    </vstack>
                ) : null}
                {pRow(c.date, 'Date Time', getDate(c.date))}
            </vstack>
        </vstack>
    );
};

const AtcfNone = () => {
    return (
        <vstack
            height="200px"
            alignment="middle center"
            border="thin"
            cornerRadius="medium"
            lightBackgroundColor="PureGray-100"
            darkBackgroundColor="PureGray-800"
            lightBorderColor="PureGray-300"
            darkBorderColor="PureGray-600"
        >
            <text size="xlarge" width="100%" wrap alignment="middle center">No storms currently being tracked.</text>
        </vstack>
    );
};

export const AtcfPage = (props: AtcfPageProps) => {
    // Get dimensions from context
    const widgetWidth = props.context.dimensions?.width ?? 288;

    if (!props.atcf) {
        return (
            <vstack>
                <spacer size="medium" />
                <vstack
                    padding="small"
                    border="thin"
                    lightBackgroundColor="PureGray-100"
                    darkBackgroundColor="PureGray-800"
                    lightBorderColor="PureGray-300"
                    darkBorderColor="PureGray-600"
                    alignment="center middle"
                    cornerRadius="medium"
                >
                    <text
                        weight="bold"
                        size="large"
                        wrap
                    >
                        Failed to load Automatic Tropical Cyclone Forecast. Try again later.
                    </text>
                </vstack>
            </vstack>
        );
    }

    // Generate storm list
    const atcfStorms = props.atcf.map(s => <AtcfStormWidget context={props.context} storm={s} />);

    return (
        <vstack>
            <spacer size="medium" />
            <vstack
                padding="small"
                border="thin"
                alignment="center middle"
                cornerRadius="medium"
                lightBackgroundColor="PureGray-100"
                darkBackgroundColor="PureGray-800"
                lightBorderColor="PureGray-300"
                darkBorderColor="PureGray-600"
            >
                <text weight="bold" size="large">{widgetWidth < 500 ? 'Auto Trop Cyclone Forecast (ATCF)' : 'Automatic Tropical Cyclone Forecast (ATCF)'}</text>
                <text size="xsmall">Open Details</text>
            </vstack>
            <spacer size="medium" />
            {atcfStorms && atcfStorms.length > 0 ? atcfStorms : <AtcfNone />}
        </vstack>
    );
};