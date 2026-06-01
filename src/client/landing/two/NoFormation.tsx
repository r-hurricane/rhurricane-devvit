/*!
* Component for the "No Formation Expected" message.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {HiMiniCheckCircle} from "react-icons/hi2";

export const NoFormation = () => {
    return (
        <div className="w-full p-2 flex items-center gap-2 rounded-md border-1 border-lime-200 dark:border-lime-700 bg-lime-50 dark:bg-lime-950">
            <div className="text-lime-600 dark:text-lime-300">
                <HiMiniCheckCircle className="size-6" />
            </div>
            <div>
                No new formation expected in the next 7 days.
            </div>
        </div>
    );
};
