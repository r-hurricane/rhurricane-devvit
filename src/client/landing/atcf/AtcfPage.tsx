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

export const AtcfPage = ({
    atcfData
}: {
    atcfData: SummaryApiData<AtcfData[]>
}) => {
    return (
        <ErrorBoundary fallback={<LoadingOrError error={true} />} onError={console.error}>
            <div className="flex flex-col gap-1">
                <PageHeading
                    Icon={PiHurricaneThin}
                    heading="Automatic Tropical Cyclone Forecast (ATCF)"
                    subHeading={formatDate(atcfData.lastModified)}
                />
            </div>
        </ErrorBoundary>
    );
};
