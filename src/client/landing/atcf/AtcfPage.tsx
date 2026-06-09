/*!
* The Automatic Tropical Cyclone Forecast page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {PageHeading} from "../general/PageHeading";
import {AtcfData} from "../../../shared/dtos/redis/summary-api/SummaryApiAtcfDtos";
import {SummaryApiData} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos";
import {LoadingOrError} from "../../shared/LoadingOrError";
import {ErrorBoundary} from "react-error-boundary";
import {PiHurricaneThin} from "react-icons/pi";
import {formatDate} from "../../shared/formatDate";
import {AtcfStormCard} from "./AtcfStormCard";

export const AtcfPage = ({
    atcfData
}: {
    atcfData: SummaryApiData<AtcfData[]> | undefined
}) => {
    if (!atcfData) {
        return (
            <div className="flex flex-col gap-1">
                Failed to load the Automatic Tropical Cyclone Forecast (ATCF).
            </div>
        );
    }
    return (
        <ErrorBoundary fallback={<LoadingOrError error={true} />} onError={console.error}>
            <div className="flex flex-col gap-1">
                <PageHeading
                    Icon={PiHurricaneThin}
                    heading="Automatic Tropical Cyclone Forecast (ATCF)"
                    subHeading={`Best Track - ${formatDate(atcfData.lastModified)}`}
                />
                {atcfData.data.length > 0
                    ? (
                        <>
                            <div className="w-full px-2 grid grid-cols-5 gap-2 text-left gap-2 text-[10px] text-puregray-600 dark:text-puregray-400">
                                <span className="col-span-2">Name</span>
                                <span>Psur</span>
                                <span>Wind/Gust</span>
                                <span>Wind Radi</span>
                            </div>
                            {atcfData.data.map(s => <AtcfStormCard storm={s} />)}
                        </>
                    )
                    : (
                        <div className="h-20 flex justify-center items-center">
                            No storms currently being tracked.
                        </div>
                    )
                }
            </div>
        </ErrorBoundary>
    );
};
