/*!
* The Automatic Tropical Cyclone Forecast page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Nous42Mission} from "../../../shared/dtos/redis/summary-api/SummaryApiTcpodDtos";
import {HiMiniCheckCircle} from "react-icons/hi2";

export const TcpodStormList = ({
    storms
}: {
    storms: {[key: string]: Nous42Mission[]};
}) => {

    // If no storms, show no missions message.
    const keys = Object.keys(storms);
    if (keys.length <= 0) {
        return (
            <div className="w-full p-2 flex items-center gap-2 rounded-md border-1 border-puregray-200 dark:border-puregray-700 bg-puregray-50 dark:bg-puregray-900">
                <div className="text-puregray-500">
                    <HiMiniCheckCircle className="size-6" />
                </div>
                <div>
                    No missions scheduled.
                </div>
            </div>
        );
    }

    // Helper to render date
    const renderDate = (time: number | undefined | null): string => {
        if (!time) return 'Unknown';
        const date = new Date(time);
        if (!date || isNaN(date.getTime())) return 'Unknown';
        return `${(date.getUTCMonth()+1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}z`;
    }

    // Helper to get flight status message
    const getStatus = (s: Nous42Mission): string => {
        const now = new Date().getTime();

        // If the departure time is in the future, display departure date
        const departs = s.departure?.time;
        if (departs && departs > now)
            return 'Departs ' + renderDate(departs);

        // If the in-storm mission start window is in the future, display arrival date
        const window = s.window?.start?.time;
        if (window && window > now)
            return 'En Route ' + renderDate(window);

        // If the in-storm mission end window is in the future, mission is in storm
        const end = s.window?.end?.time;
        if (end && end > now)
            return 'In Storm';

        // Otherwise, end window passed and mission is complete
        return 'Complete';
    };

    return (
        <div>
            {Object.keys(storms).map(k => (
                <div key={k} className="w-full p-2 flex flex-col gap-2 rounded-md border-1 border-puregray-200 dark:border-puregray-700 bg-puregray-50 dark:bg-puregray-900">
                    <div>{k}</div>
                    <div>
                        {storms[k] && storms[k].map(s => {
                            const status = getStatus(s);
                            return (
                                <div
                                    key={s.id}
                                    className={`
                                        ${status === 'Complete' ? 'text-neutral-content-weak' : '' }
                                        ${status === 'In Storm' ? 'font-bood' : ''}
                                    `}
                                >
                                    {s.name} - {status}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
