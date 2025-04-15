/*!
 * Renders the Tropical Cyclone Plan of the Day (TCPOD) (AKA the Recon Schedule) from the summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context} from "@devvit/public-api";
import {Nous42Basin, Nous42Mission, TcpodData} from "../../../../shared/dtos/redis/summary-api/SummaryApiTcpodDtos.js";

export interface TcpodPageProps {
    context: Context;
    tcpod: TcpodData | undefined;
}

export const NoMissions = () => {
    return (
        <vstack>
            <spacer size="xsmall" />
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

    const getBasinSummary =
        (today: Nous42Basin | null | undefined, tomorrow: Nous42Basin | null | undefined) => {
            const storms = (today?.storms || [])
                .concat(tomorrow?.storms || [])
                .reduce((a, v) => {
                    if (v.name != null)
                        a[v.name] = a[v.name] ? a[v.name].concat(v.missions) : v.missions;
                    return a;
                }, {} as {[key: string]: Nous42Mission[]});

            if (Object.keys(storms).length <= 0 && (!tomorrow || tomorrow.outlook.every(o => o.negative)))
                return (<NoMissions />);

            return (
                <vstack>
                    <text>Todo: Implement schedule</text>
                </vstack>
            );
        };

    const atlanticSummary = getBasinSummary(props.tcpod.today?.message.atlantic, props.tcpod.tomorrow?.message.atlantic);
    const pacificSummary = getBasinSummary(props.tcpod.today?.message.pacific, props.tcpod.tomorrow?.message.pacific);

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
                <text weight="bold" size="large">{widgetWidth < 500 ? 'Recon Mission Schedule (TCPOD)' : 'Tropical Cyclone Plan of the Day (TCPOD)'}</text>
                <text size="xsmall">Open Details</text>
            </vstack>
            <spacer size="medium" />
            <hstack>
                <text weight="bold" size="xlarge">Atlantic</text>
            </hstack>
            {atlanticSummary}
            <spacer size="medium" />
            <hstack>
                <text weight="bold" size="xlarge">Pacific</text>
            </hstack>
            {pacificSummary}
        </vstack>
    );
};