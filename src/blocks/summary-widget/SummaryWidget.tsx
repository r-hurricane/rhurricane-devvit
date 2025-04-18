﻿/*!
 * An interactive post widget for the "Summary" post type. Displays a summary of the current Tropical Weather from the
 * National Hurricane Center:
 * - Tropical Weather Outlook (TWO) - The potential areas of tropical development
 * - Automatic Tropical Cyclone Forecast (ATCF) - The detailed data generated by the ATCF for active storms
 * - Tropical Cyclone Plan of the Day (TCPOD) - The Hurricane Hunter recon schedule for missions into active storms
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context, Devvit, useState, useAsync} from "@devvit/public-api";
import {MenuItem} from './MenuItem.js';
import {TwoPage} from "./two/TwoPage.js";
import {AtcfPage} from "./atcf/AtcfPage.js";
import {TcpodPage} from "./tcpod/TcpodPage.js";
import {RedisService} from "../../devvit/redis/RedisService.js";
import {LoadingOrError} from "../LoadingOrError.js";
import {SummaryApiDto} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos.js";
import {AppSettings} from "../../devvit/AppSettings.js";

export interface SummaryWidgetProps {
    context: Context;
}

export const SummaryWidget = (props: SummaryWidgetProps) => {
    const [activePage, setActivePage] = useState('TWO');

    const {data, loading, error} = useAsync(
        async () => {
            // Create Redis service
            const redis = new RedisService(props.context.redis);

            // Get API last modified
            const lastMod = await redis.getSummaryApiLastModified();
            if (!lastMod)
                throw new Error('Failed to load LastModified from Redis.');

            // Fail if not a valid date string
            const date = new Date(lastMod);
            if (!date || isNaN(date.getTime()))
                throw new Error(`[Summary Post] LastModified date of ${lastMod} was invalid`);

            // Check last modified is < {setting} hours ago
            const staleSetting = await AppSettings.GetStaleHours(props.context.settings);
            const saleTime = new Date().getTime() - staleSetting * 3600000;
            if (date.getTime() < saleTime)
                throw new Error(`[Summary Post] API Data is stale, last modified at ${lastMod} which is over ${staleSetting} hours ago!`);

            // Finally, fetch the actual data!
            return await redis.getSummaryApiData();
        },
        {
            finally: (_, error) => {
                if (error)
                    console.error('[Summary Load] ' + error);
            }
        }
    );
    const loaded = !loading && !error;
    const twoData: SummaryApiDto | null = loaded ? data : null;

    return (
        <zstack width="100%" height="100%">
            <vstack padding="small" width="100%" height="100%" grow lightBackgroundColor="Global-White" darkBackgroundColor="Global-Black">
                <hstack gap="small">
                    <MenuItem activePage={activePage} disabled={loading || !!error} setActivePage={setActivePage} count={twoData?.two?.count} title="TWO" />
                    <MenuItem activePage={activePage} disabled={loading || !!error} setActivePage={setActivePage} count={twoData?.atcf?.count} title="ATCF" />
                    <MenuItem activePage={activePage} disabled={loading || !!error} setActivePage={setActivePage} count={twoData?.tcpod?.count} title="TCPOD" />
                </hstack>
                {!loaded && <LoadingOrError message='Loading Tropical Weather Outlook...' />}
                {loaded && activePage === 'TWO' && <TwoPage context={props.context} two={twoData?.two?.data} />}
                {loaded && activePage === 'ATCF' && <AtcfPage context={props.context} atcf={twoData?.atcf?.data} />}
                {loaded && activePage === 'TCPOD' && <TcpodPage context={props.context} tcpod={twoData?.tcpod?.data} />}
            </vstack>
            <vstack width="100%" height="100%" alignment="bottom start">
                <hstack
                    width="100%"
                    border="thin"
                    alignment="top center"
                    lightBackgroundColor="Global-White"
                    darkBackgroundColor="Global-Black"
                    onPress={() => {setActivePage('DIS')}}
                >
                    <text size="medium" weight="bold">&gt; &gt; &gt; Press to review Data Disclaimer! &lt; &lt; &lt;</text>
                </hstack>
            </vstack>
            {activePage === 'DIS' && (
                <vstack width="100%" height="100%" padding="medium" alignment="top start" gap="small" lightBackgroundColor="Global-White" darkBackgroundColor="Global-Black">
                    <text style="heading" size="xlarge">Data Disclaimer</text>
                    <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white" />
                    <text size="xlarge" weight="bold" color="danger-plain" wrap>This app is is NOT an official government app and therefore should not be used for any decisions pertaining to your safety or security!</text>
                    <text wrap>Please visit the Official National Hurricane Center (NHC) (https://nhc.noaa.gov) or the Official Joint Typhoon Warning Center (JTWC) (https://www.metoc.navy.mil/ jtwc/jtwc.html) pages for official government warnings and data.</text>
                    <text wrap>Data obtained from the National Hurricane Center (NHC) and National Weather Service (NWS)</text>
                    <text wrap>Developed and maintained by u/Beach-Brews</text>
                    <hstack width="100%" alignment="bottom center">
                        <button width="100%" onPress={() => {setActivePage('TWO')}}>Acknowledged</button>
                    </hstack>
                </vstack>
            )}
        </zstack>
    );
};