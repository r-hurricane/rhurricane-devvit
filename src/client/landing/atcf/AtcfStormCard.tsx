/*!
* The Automatic Tropical Cyclone Forecast page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {AtcfData} from "../../../shared/dtos/redis/summary-api/SummaryApiAtcfDtos";
import {useLandingContext} from "../LandingContext";
import {distanceString, speedString} from "../../shared/unitConversion";
import {getAtcfCardStyle} from "./AtcfStormCardStyle";
import {AtcfStormModal} from "./AtcfStormModal";

export const AtcfStormCard = ({
    storm
}: {
    storm: AtcfData
}) => {
    const ctx = useLandingContext();
    const c = storm.data[0];
    if (!c) return;

    const style = getAtcfCardStyle(c.levelCode === 'DB' ? null : c.maxSusWind);

    return (
        <button
            onClick={() => ctx.setModal(<AtcfStormModal storm={storm} />)}
            className={`w-full p-2 grid grid-cols-5 gap-2 text-left gap-2 cursor-pointer
            rounded-md border-1 ${style.border} ${style.background}`}
        >
            <div className="col-span-2">
                {c.basin}{c.stormNo ? Math.floor(c.stormNo).toString().padStart(2, '0') : '??'} -&nbsp;
                {c.name && c.name !== 'INVEST' ? c.name.charAt(0) + c.name.slice(1).toLowerCase() : 'Invest'}
            </div>
            <div>{c.minSeaLevelPsur}mb</div>
            <div>{speedString(c.maxSusWind, ctx.data?.userPreferences?.speed, !c.windGust || c.windGust <= 0)}
                {c.windGust && c.windGust> 0 ? `/${speedString(c.windGust, ctx.data?.userPreferences?.speed)}` : ''}
            </div>
            <div>{distanceString(c.maxWindRad, ctx.data?.userPreferences?.distance)}</div>
        </button>
    );
};
