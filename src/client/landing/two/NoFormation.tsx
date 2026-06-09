/*!
* Component for the "No Formation Expected" message.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {HiMiniCheckCircle} from "react-icons/hi2";

export const NoFormation = () => {
    return (
        <div className="w-full p-2 flex items-center gap-2 rounded-md border-1 border-puregray-200 dark:border-puregray-700 bg-puregray-50 dark:bg-puregray-900">
            <div className="text-puregray-500">
                <HiMiniCheckCircle className="size-6" />
            </div>
            <div>
                No new formation expected in the next 7 days.
            </div>
        </div>
    );
};
