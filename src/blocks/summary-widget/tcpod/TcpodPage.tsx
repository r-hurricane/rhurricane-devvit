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

export interface TcpodPageProps {
    context: Context;
    tcpod: TcpodData | undefined;
}

export interface StormListProps {
    storms: {[key: string]: Nous42Mission[]};
}

export const StormList = (props: StormListProps) => {
    const keys = Object.keys(props.storms);
    if (keys.length <= 0) {
        return (
            <vstack>
                <hstack
                    height="100px"
                    alignment="middle center"
                    padding="small"
                    border="thin"
                    cornerRadius="small"
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

    const renderDate = (time: number | undefined | null): string => {
        if (!time) return 'Unknown';
        const date = new Date(time);
        if (!date || isNaN(date.getTime())) return 'Unknown';
        return `${(date.getUTCMonth()+1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}z`;
    }

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
                            let status;
                            const now = new Date().getTime();
                            const departs = s.departure?.time;
                            const window = s.window?.start?.time;
                            const end = s.window?.end?.time;
                            if (departs && departs > now) {
                                status = 'Departs ' + renderDate(departs);
                            } else if (window && window > now) {
                                status = 'En Route ' + renderDate(window);
                            } else if (end && end > now) {
                                status = 'In Storm';
                            } else {
                                status = 'Complete';
                            }
                            return (
                                <text color={status === 'Complete' ? 'neutral-content-weak' : '' } weight={status === 'In Storm' ? 'bold' : 'regular'}>{s.name} - {status}</text>
                            );
                        })}
                    </vstack>
                </vstack>
            ))}
        </vstack>
    );
}

export interface TcpodOutlookProps {
    outlook: Nous42Outlook[];
}

export const TcpodOutlook = (props: TcpodOutlookProps) => {
    if (props.outlook.length <= 0) {
        return (
            <vstack>
                <hstack
                    height="100px"
                    alignment="middle center"
                    padding="small"
                    border="thin"
                    cornerRadius="small"
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

export const TcpodPage = (props: TcpodPageProps) => {

    // Get dimensions from context
    const widgetWidth = props.context.dimensions?.width ?? 288;

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

    const [activeBasin, setActiveBasin] = useState<'Atlantic' | 'Pacific'>('Atlantic');

    const getBasinCounts =
        (today: Nous42Basin | null | undefined, tomorrow: Nous42Basin | null | undefined) => {
            const storms = (today?.storms || [])
                .concat(tomorrow?.storms || [])
                .reduce((a, v) => {
                    if (v.name != null)
                        a[v.name] = a[v.name] ? a[v.name].concat(v.missions) : v.missions;
                    return a;
                }, {} as {[key: string]: Nous42Mission[]});
            const tomorrowOutlook = tomorrow && !tomorrow.outlook.every(o => o.negative)
                ? tomorrow.outlook
                : [];

            return { storms, tomorrowOutlook, stormCount: Object.keys(storms).length, outlookCount: tomorrowOutlook.length };
        };

    const atlanticCounts = getBasinCounts(props.tcpod.today?.message.atlantic, props.tcpod.tomorrow?.message.atlantic);
    const pacificCounts = getBasinCounts(props.tcpod.today?.message.pacific, props.tcpod.tomorrow?.message.pacific);
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
                {/*<text size="xsmall">Open Details</text>*/}
            </vstack>
            <spacer size="medium" />
            <hstack width="100%" gap="small">
                <TcpodBasinButton title="Atlantic" missions={atlanticCounts.stormCount} outlook={atlanticCounts.outlookCount} activeBasin={activeBasin} setActiveBasin={setActiveBasin} />
                <TcpodBasinButton title="Pacific" missions={pacificCounts.stormCount} outlook={pacificCounts.outlookCount} activeBasin={activeBasin} setActiveBasin={setActiveBasin} />
            </hstack>
            <spacer size="medium" />
            <vstack gap="small">
                <StormList storms={activeCounts.storms} />
                <TcpodOutlook outlook={activeCounts.tomorrowOutlook} />
            </vstack>
        </vstack>
    );
};