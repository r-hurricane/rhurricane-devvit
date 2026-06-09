/*!
* The Tropical Cyclone Plan Of the Day page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {PageHeading} from "../general/PageHeading";
import {
    Nous42Basin,
    Nous42Mission,
    Nous42Outlook,
    TcpodData
} from "../../../shared/dtos/redis/summary-api/SummaryApiTcpodDtos";
import {SummaryApiData} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos";
import {LoadingOrError} from "../../shared/LoadingOrError";
import {ErrorBoundary} from "react-error-boundary";
import {PiAirplaneTiltLight} from "react-icons/pi";
import {formatDate} from "../../shared/formatDate";
import {ButtonGroup, ButtonGroupOption} from "../general/ButtonGroup";
import {useMemo, useState} from "react";
import {TcpodStormList} from "./TcpodStormList";
import {TcpodOutlook} from "./TcpodOutlook";

type BasinSelector = 'al' | 'pa';

const EmptyPlan = {
    storms: {} as {[key: string]: Nous42Mission[]},
    tomorrowOutlook: [] as Nous42Outlook[],
    missionCount: 0,
    outlookCount: 0
};

// Helper to consolidate each basin storm + mission info, plus get total mission & outlook counts for basin buttons
const getBasinCounts =
    (today: Nous42Basin | null | undefined, tomorrow: Nous42Basin | null | undefined) => {
        // Generate an object with storm name as a key and missions for storm as the value
        const storms = (today?.storms || [])
            .concat(tomorrow?.storms || [])
            .reduce((a, v) => {
                if (v.name != null)
                    a[v.name] = a[v.name] ? a[v.name]!.concat(v.missions) : v.missions;
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

export const TcpodPage = ({
    tcpodData
}: {
    tcpodData: SummaryApiData<TcpodData> | undefined
}) => {

    // Get the TCPOD mission counts and outlooks for both basins (to show counts on toggle buttons)
    const [atlanticCounts, pacificCounts] = useMemo(() => {
        return !tcpodData ? [EmptyPlan, EmptyPlan] :  [
            getBasinCounts(tcpodData.data.today?.message.atlantic, tcpodData.data.tomorrow?.message.atlantic),
            getBasinCounts(tcpodData.data.today?.message.pacific, tcpodData.data.tomorrow?.message.pacific)
        ]
    }, [tcpodData]);

    // Use state for which basin is being looked at
    const [basin, setBasin] = useState<BasinSelector>(() => atlanticCounts.missionCount <= 0 && pacificCounts.missionCount > 0 ? 'pa' : 'al');

    if (!tcpodData) {
        return (
            <div className="flex flex-col gap-1">
                Failed to load the Tropical Cyclone Plan Of the Day (TCPOD).
            </div>
        );
    }

    const BasinButtons = [
        { label: 'Atlantic', value: 'al', count: atlanticCounts.missionCount, subCount: atlanticCounts.outlookCount },
        { label: 'Pacific', value: 'pa', count: pacificCounts.missionCount, subCount: pacificCounts.outlookCount }
    ] satisfies ButtonGroupOption<BasinSelector>[];

    return (
        <ErrorBoundary fallback={<LoadingOrError error={true} />} onError={console.error}>
            <div className="flex h-full min-h-0 flex-col gap-1">
                <PageHeading
                    Icon={PiAirplaneTiltLight}
                    heading="Tropical Cyclone Plan Of the Day (TCPOD)"
                    subHeading={
                        formatDate(tcpodData.data?.tomorrow?.message?.header?.issued?.time
                            ?? tcpodData.data?.today?.message?.header?.issued?.time
                            ?? tcpodData.lastModified)
                    }
                />
                <ButtonGroup
                    options={BasinButtons}
                    selected={basin}
                    onSelect={setBasin}
                />
                <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
                    <TcpodStormList storms={basin === 'al' ? atlanticCounts.storms : pacificCounts.storms} />
                    <TcpodOutlook outlook={basin === 'al' ? atlanticCounts.tomorrowOutlook : pacificCounts.tomorrowOutlook} />
                </div>
            </div>
        </ErrorBoundary>
    );
};
