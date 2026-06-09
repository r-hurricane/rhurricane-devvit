/*!
* The Automatic Tropical Cyclone Forecast page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Nous42Outlook} from "../../../shared/dtos/redis/summary-api/SummaryApiTcpodDtos";
import {HiMiniCheckCircle} from "react-icons/hi2";

export const TcpodOutlook = ({
    outlook
}: {
    outlook: Nous42Outlook[];
}) => {

    // If no (non-negative) outlook text, display no outlook
    if (outlook.length <= 0) {
        return (
            <div className="w-full p-2 flex items-center gap-2 rounded-md border-1 border-puregray-200 dark:border-puregray-700 bg-puregray-50 dark:bg-puregray-900">
                <div className="text-puregray-500">
                    <HiMiniCheckCircle className="size-6" />
                </div>
                <div>
                    Outlook is negative.
                </div>
            </div>
        );
    }

    // Otherwise, print each outlook text
    return (
        <div>
            <div>Tomorrow's Outlook</div>
            <div>
                {outlook.map(o => (<div>* {o.text}</div>))}
            </div>
        </div>
    );
};
