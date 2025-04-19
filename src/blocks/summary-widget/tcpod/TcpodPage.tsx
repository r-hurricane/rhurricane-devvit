/*!
 * Renders the Tropical Cyclone Plan of the Day (TCPOD) (AKA the Recon Schedule) from the summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context, useState} from "@devvit/public-api";
import {
    Nous42Basin,
    Nous42Mission, Nous42Outlook,
    TcpodData
} from "../../../../shared/dtos/redis/summary-api/SummaryApiTcpodDtos.js";

// Renders the missions for each storm provided
export interface StormListProps {
    storms: {[key: string]: Nous42Mission[]};
}

export const StormList = (props: StormListProps) => {

    // If no storms, show no missions message.
    const keys = Object.keys(props.storms);
    if (keys.length <= 0) {
        return (
            <vstack>
                <hstack
                    height="100px"
                    alignment="middle center"
                    padding="small"
                    border="thin"
                    cornerRadius="medium"
                    lightBackgroundColor="PureGray-100"
                    backgroundColor="PureGray-800"
                    lightBorderColor="PureGray-300"
                    darkBorderColor="PureGray-600"
                    gap="small"
                >
                    <text size="xlarge" width="100%" wrap alignment="middle center">No missions scheduled.</text>
                </hstack>
            </vstack>
        );
    }

    // Helper to render date
    const renderDate = (time: number | undefined | null): string => {
        if (!time) return 'Unknown';
        const date = new Date(time);
        if (!date || isNaN(date.getTime())) return 'Unknown';
        return `${(date.getUTCMonth()+1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}z`;
    }

    // Helper to get flight status message
    const getStatus = (s: Nous42Mission): string => {
        const now = new Date().getTime();

        // If the departure time is in the future, display departure date
        const departs = s.departure?.time;
        if (departs && departs > now)
            return 'Departs ' + renderDate(departs);

        // If the in-storm mission start window is in the future, display arrival date
        const window = s.window?.start?.time;
        if (window && window > now)
            return 'En Route ' + renderDate(window);

        // If the in-storm mission end window is in the future, mission is in storm
        const end = s.window?.end?.time;
        if (end && end > now)
            return 'In Storm';

        // Otherwise, end window passed and mission is complete
        return 'Complete';
    };

    return (
        <vstack>
            {Object.keys(props.storms).map(k => (
                <vstack
                    padding="small"
                    border="thin"
                    lightBackgroundColor="PureGray-100"
                    darkBackgroundColor="PureGray-800"
                    lightBorderColor="PureGray-300"
                    darkBorderColor="PureGray-600"
                    cornerRadius="medium"
                >
                    <text weight="bold">{k}</text>
                    <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white"></hstack>
                    <spacer size="xsmall" />
                    <vstack>
                        {props.storms[k] && props.storms[k].map(s => {
                            const status = getStatus(s);
                            return (
                                <text
                                    color={status === 'Complete' ? 'neutral-content-weak' : '' }
                                    weight={status === 'In Storm' ? 'bold' : 'regular'}
                                >
                                    {s.name} - {status}
                                </text>
                            );
                        })}
                    </vstack>
                </vstack>
            ))}
        </vstack>
    );
}

// Renders the outlook for tomorrow (plan for tomorrow)
export interface TcpodOutlookProps {
    outlook: Nous42Outlook[];
}

export const TcpodOutlook = (props: TcpodOutlookProps) => {

    // If no (non-negative) outlook text, display no outlook
    if (props.outlook.length <= 0) {
        return (
            <vstack>
                <hstack
                    height="100px"
                    alignment="middle center"
                    padding="small"
                    border="thin"
                    cornerRadius="medium"
                    lightBackgroundColor="PureGray-100"
                    backgroundColor="PureGray-800"
                    lightBorderColor="PureGray-300"
                    darkBorderColor="PureGray-600"
                    gap="small"
                >
                    <text size="xlarge" width="100%" wrap alignment="middle center">Outlook is negative.</text>
                </hstack>
            </vstack>
        );
    }

    // Otherwise, print each outlook text
    return (
        <vstack
            padding="small"
            border="thin"
            lightBackgroundColor="PureGray-100"
            darkBackgroundColor="PureGray-800"
            lightBorderColor="PureGray-300"
            darkBorderColor="PureGray-600"
            cornerRadius="medium"
        >
            <text weight="bold">Tomorrow's Outlook</text>
            <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white"></hstack>
            <spacer size="small" />
            <vstack gap="small">
                {props.outlook.map(o => (<text wrap>* {o.text}</text>))}
            </vstack>
        </vstack>
    );
}

// Renders the two Atlantic and Pacific basin buttons to switch between schedules
export interface TcpodBasinButtonProps {
    title: 'Atlantic' | 'Pacific';
    activeBasin: string;
    setActiveBasin: (newBasin: 'Atlantic' | 'Pacific') => void;
    missions: number;
    outlook: number;
}

export const TcpodBasinButton = (props: TcpodBasinButtonProps) => {
    const isActive = props.activeBasin === props.title;
    const hasCount = props.missions > 0 || props.outlook > 0;
    return (
        <hstack
            padding="small"
            border={isActive ? 'thick' : 'thin'}
            cornerRadius="medium"
            lightBackgroundColor={isActive ? 'AlienBlue-100' : (hasCount ? 'Yellow-50' : 'PureGray-50')}
            lightBorderColor={isActive ? 'AlienBlue-700' : (hasCount ? 'Yellow-300' : 'PureGray-300')}
            darkBackgroundColor={isActive ? 'AlienBlue-800' : (hasCount ? 'Yellow-800' : 'PureGray-800')}
            darkBorderColor={isActive ? 'AlienBlue-400' : (hasCount ? 'Yellow-600' : 'PureGray-600')}
            width="50%"
            alignment="middle center"
            onPress={() => props.setActiveBasin(props.title)}
        >
            <text
                size="large"
                weight={isActive ? 'bold' : 'regular'}
                lightColor={isActive ? 'AlienBlue-900' : ''}
                darkColor={isActive ? 'AlienBlue-50' : ''}
            >
                {props.title}
            </text>
            <spacer size="xsmall"/>
            <text size="small">({props.missions} - {props.outlook})</text>
        </hstack>
    );
};

// Renders the hurricane hunter recon schedule (TCPOD) page
export interface TcpodPageProps {
    context: Context;
    tcpod: TcpodData | undefined;
}

export const TcpodPage = (props: TcpodPageProps) => {

    // Get dimensions from context
    const widgetWidth = props.context.dimensions?.width ?? 288;

    // If data is missing, show error loading.
    if (!props.tcpod) {
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
                        Failed to load Tropical Cyclone Plan of the Day schedule. Try again later.
                    </text>
                </vstack>
            </vstack>
        );
    }

    // Helper to consolidate each basin storm + mission info, plus get total mission & outlook counts for basin buttons
    const getBasinCounts =
        (today: Nous42Basin | null | undefined, tomorrow: Nous42Basin | null | undefined) => {
            // Generate an object with storm name as a key and missions for storm as the value
            const storms = (today?.storms || [])
                .concat(tomorrow?.storms || [])
                .reduce((a, v) => {
                    if (v.name != null)
                        a[v.name] = a[v.name] ? a[v.name].concat(v.missions) : v.missions;
                    return a;
                }, {} as {[key: string]: Nous42Mission[]});

            // Only count the outlook if non-negative text exists
            const tomorrowOutlook = tomorrow && !tomorrow.outlook.every(o => o.negative)
                ? tomorrow.outlook
                : [];

            return {
                storms,
                tomorrowOutlook,
                missionCount: Object.values(storms).reduce((a, v) => a + v.length, 0),
                outlookCount: tomorrowOutlook.length
            };
        };

    // Get the TCPOD mission counts and outlooks for both basins (to show counts on toggle buttons)
    const atlanticCounts = getBasinCounts(props.tcpod.today?.message.atlantic, props.tcpod.tomorrow?.message.atlantic);
    const pacificCounts = getBasinCounts(props.tcpod.today?.message.pacific, props.tcpod.tomorrow?.message.pacific);

    // Create state for active basin selection. Choose pacific if it has missions and atlantic is negative.
    const [activeBasin, setActiveBasin] = useState<'Atlantic' | 'Pacific'>(
        atlanticCounts.missionCount <= 0 && pacificCounts.missionCount > 0 ? 'Pacific' : 'Atlantic'
    );
    const activeCounts = activeBasin === 'Atlantic' ? atlanticCounts : pacificCounts;

    return (
        <vstack width="100%">
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
                <text weight="bold" size="large">{widgetWidth < 500 ? 'Recon Mission Schedule (TCPOD)' : 'Tropical Cyclone Plan of the Day (TCPOD)'}</text>
                {/* Temporarily remove webview note, until webview is added */}
                {/*<text size="xsmall">Open Details</text>*/}
            </vstack>
            <spacer size="medium" />
            <hstack width="100%" gap="small">
                <TcpodBasinButton title="Atlantic" missions={atlanticCounts.missionCount} outlook={atlanticCounts.outlookCount} activeBasin={activeBasin} setActiveBasin={setActiveBasin} />
                <TcpodBasinButton title="Pacific" missions={pacificCounts.missionCount} outlook={pacificCounts.outlookCount} activeBasin={activeBasin} setActiveBasin={setActiveBasin} />
            </hstack>
            <spacer size="medium" />
            <vstack gap="small">
                <StormList storms={activeCounts.storms} />
                <TcpodOutlook outlook={activeCounts.tomorrowOutlook} />
            </vstack>
        </vstack>
    );
};