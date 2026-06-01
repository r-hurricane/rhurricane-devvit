/*!
* The Tropical Weather Outlook page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {PageHeading} from "../PageHeading";
import {LuRadar} from "react-icons/lu";
import {OutlookCard} from "./OutlookCard";
import {NoFormation} from "./NoFormation";
import {TwoData} from "../../../shared/dtos/redis/summary-api/SummaryApiTwoDtos";
import {SummaryApiData} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos";
import {LoadingOrError} from "../../shared/LoadingOrError";
import {ErrorBoundary} from "react-error-boundary";

export const TwoPage = ({
    twoData
}: {
    twoData: SummaryApiData<TwoData>
}) => {
    return (
        <ErrorBoundary fallback={<LoadingOrError error={true} />} onError={console.error}>
            <div className="flex flex-col gap-1">
                <PageHeading
                    Icon={LuRadar}
                    heading="Tropical Weather Outlook (TWO)"
                    subHeading="2026-05-30 00z"
                />
                <h2 className="mt-2 font-semibold text-neutral-content-strong uppercase">Atlantic</h2>
                {twoData.data.basins.atlantic.areas.length > 0
                    ? twoData.data.basins.atlantic.areas.map(a =>
                        <OutlookCard key={`alaoi${a.id}`} area={a} />)
                    : (<NoFormation />)
                }
                <h2 className="mt-2 font-semibold text-neutral-content-strong uppercase">East/Central Pacific</h2>
                {twoData.data.basins.pacific.areas.length > 0
                    ? twoData.data.basins.pacific.areas.map(a =>
                        <OutlookCard key={`paaoi${a.id}`} area={a} />)
                    : (<NoFormation />)
                }
            </div>
        </ErrorBoundary>
    );
};
