/*!
* Component for a single Outlook AOI.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {TwoAreaOfInterest} from "../../../shared/dtos/redis/summary-api/SummaryApiTwoDtos";
import {useLandingContext} from "../LandingContext";
import {OutlookModal} from "./OutlookModal";
import {getOutlookCardStyle} from "./OutlookCardStyle";

export const OutlookCard = ({
    area
}: {
    area: TwoAreaOfInterest;
}) => {
    const ctx = useLandingContext();

    // Determine the color style for the card, based on 7-day chance
    const sevenDay = area.sevenDay?.chance ?? 0;
    const level = sevenDay >= 60
        ? 'high'
        : sevenDay >= 40
            ? 'medium'
            : sevenDay > 0 ? 'low' : 'none';
    const style = getOutlookCardStyle(level);

    return (
        <button onClick={() => ctx.setModal(<OutlookModal area={area} style={style} />)} className={`w-full p-2 flex justify-start items-center text-left gap-2 cursor-pointer rounded-md border-1 ${style.border} ${style.background}`}>
            <div className={`rounded-full p-1 ${style.iconBackground} ${style.text}`}>
                <style.Icon className="size-4" />
            </div>
            <div className="flex-1 flex flex-col">
                <div className={style.text}>
                    <strong>{Math.floor(area.twoDay?.chance ?? 0)}%</strong> (48h) |&nbsp;
                    <strong>{Math.floor(sevenDay)}%</strong> (7d)
                </div>
                <div>{area.title}</div>
            </div>
        </button>
    );
};
