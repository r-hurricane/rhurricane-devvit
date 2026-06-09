/*!
* The Tropical Weather Outlook page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {PageHeading} from "../general/PageHeading";
import {LuRadar} from "react-icons/lu";
import {OutlookCard} from "./OutlookCard";
import {NoFormation} from "./NoFormation";
import {TwoData} from "../../../shared/dtos/redis/summary-api/SummaryApiTwoDtos";
import {SummaryApiData} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos";
import {LoadingOrError} from "../../shared/LoadingOrError";
import {ErrorBoundary} from "react-error-boundary";
import {formatDate} from "../../shared/formatDate";

export const TwoPage = ({
    twoData
}: {
    twoData: SummaryApiData<TwoData> | undefined
}) => {
    if (!twoData) {
        return (
            <div className="flex flex-col gap-1">
                Failed to load the Tropical Weather Outlook (TWO).
            </div>
        );
    }
    return (
        <ErrorBoundary fallback={<LoadingOrError error={true} />} onError={console.error}>
            <div className="flex h-full min-h-0 flex-col gap-1">
                <PageHeading
                    Icon={LuRadar}
                    heading="Tropical Weather Outlook (TWO)"
                    subHeading={formatDate(twoData.data.basins.atlantic.issuedOn?.time)}
                />
                <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
                    <h2 className="mt-2 font-semibold text-neutral-content-strong uppercase">Atlantic</h2>
                    {twoData.data.basins.atlantic.areas.length > 0
                        ? twoData.data.basins.atlantic.areas.map((a, i) =>
                            <OutlookCard key={`alaoi${i}`} area={a} />)
                        : (<NoFormation />)
                    }
                    <h2 className="mt-2 font-semibold text-neutral-content-strong uppercase">East/Central Pacific</h2>
                    {twoData.data.basins.pacific.areas.length > 0
                        ? twoData.data.basins.pacific.areas.map((a, i) =>
                            <OutlookCard key={`paaoi${i}`} area={a} />)
                        : (<NoFormation />)
                    }
                </div>
            </div>
        </ErrorBoundary>
    );
};
