/*!
* Component that shows details of an outlook AOI.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {useLandingContext} from "../LandingContext";
import {HiXMark} from "react-icons/hi2";
import {AtcfData} from "../../../shared/dtos/redis/summary-api/SummaryApiAtcfDtos";
import {getAtcfCardStyle} from "./AtcfStormCardStyle";
import {distanceString, speedString} from "../../shared/unitConversion";
import {PiGauge, PiHurricaneThin, PiNavigationArrow, PiWind} from "react-icons/pi";

// Helper method for rendering the ATCF date
const getDate = (s: string | null): string => {
    if (!s) return '';
    const d = new Date(s);
    const p = (v: number): string => v.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}-${p(d.getUTCMonth()+1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}z`;
};

export const AtcfStormModal = ({
    storm,
}: {
    storm: AtcfData;
}) => {
    const {setModal, data} = useLandingContext();
    const c = storm.data[0];
    if (!c) return;

    // Force values for position, so toFixed can easily be called.
    const lat = c.lat ?? 0;
    const lon = c.lon ?? 0;

    const style = getAtcfCardStyle(c.levelCode === 'DB' ? null : c.maxSusWind);

    // Helper for wind radius
    const windRad = (val: number | null | undefined) => {
        return c.windRad?.code
            ? distanceString(c.windRad?.code == 'AAA' ? c.windRad.ne : val, data?.userPreferences?.distance, true, 3)
            : '--';
    };

    const closeModal = () => {
        setModal(undefined);
    };

    return (
        <div
            className="z-50 fixed inset-0 w-full h-full flex justify-center items-center bg-black/70"
            onClick={closeModal}
        >
            <div
                className={`relative w-[calc(100vw-16px)] max-h-[calc(100vh-40px)] min-h-[200px] 
                flex flex-col justify-between rounded-md
                bg-white dark:bg-puregray-950
                border-1 ${style.border}
                text-xs
                `}
            >
                <button className={`absolute -top-2 -right-2 cursor-pointer ${style.background} rounded-full border-1 ${style.border}`}>
                    <HiXMark className="size-6" />
                </button>
                <div className="h-full flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className={`p-2 border-b ${style.border} ${style.background} flex justify-between`}>
                        <div>
                            {c.basin}{c.stormNo ? Math.floor(c.stormNo).toString().padStart(2, '0') : '??'} -&nbsp;
                            {c.name && c.name !== 'INVEST' ? c.name.charAt(0) + c.name.slice(1).toLowerCase() : 'Invest'}
                        </div>
                        <div className="pr-5 text-xs text-neutral-content">{getDate(c.date)}</div>
                    </div>
                    {/*TODO: Graphics*/}
                    {/*<div className="w-full h-25 min-h-25"></div>*/}
                    <div className={`flex-1 min-h-0 p-2 rounded-md`}>
                        <div className="w-full grid grid-cols-2 gap-2">
                            <div className="text-[10px] border-1 rounded-md border-puregray-200 dark:border-puregray-700">
                                <div className="flex justify-between p-2 border-b border-puregray-200 dark:border-puregray-700">
                                    <div className="flex items-center gap-1 text-neutral-content-weak">
                                        <PiWind />
                                        Wind
                                    </div>
                                    <div>
                                        {speedString(c.maxSusWind, data?.userPreferences?.speed, !c.windGust || c.windGust <= 0)}
                                        {c.windGust && c.windGust> 0 ? `/${speedString(c.windGust, data?.userPreferences?.speed)}` : ''}
                                    </div>
                                </div>
                                <div className="flex justify-between p-2 border-b border-puregray-200 dark:border-puregray-700">
                                    <div className="flex items-center gap-1 text-neutral-content-weak">
                                        <PiGauge />
                                        Pressure
                                    </div>
                                    <div>
                                        {c.minSeaLevelPsur}mb
                                    </div>
                                </div>
                                <div className="flex justify-between p-2 border-b border-puregray-200 dark:border-puregray-700">
                                    <div className="flex items-center gap-1 text-neutral-content-weak">
                                        <PiNavigationArrow />
                                        Location
                                    </div>
                                    <div>
                                        {lat.toFixed(1)}{lat > 0 ? 'N' : 'S'} {lon.toFixed(1)}{lon > 0 ? 'E' : 'W'}
                                    </div>
                                </div>
                                <div className="flex justify-between p-2">
                                    <div className="flex items-center gap-1 text-neutral-content-weak">
                                        <PiHurricaneThin />
                                        Depth
                                    </div>
                                    <div>
                                        {c.depth}
                                    </div>
                                </div>
                            </div>
                            <div className="relative border-1 rounded-md border-puregray-200 dark:border-puregray-700">
                                <div className="opacity-50 text-neutral-content-weak absolute w-2/3 h-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <PiHurricaneThin className="w-full h-full rotate-45" />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    {distanceString(c.eyeDia, data?.userPreferences?.distance)}
                                </div>
                                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                                    {speedString(c.windRad?.rad, data?.userPreferences?.speed)}
                                </div>
                                <div className="absolute left-4 top-4">
                                    {windRad(c.windRad?.nw)}
                                </div>
                                <div className="absolute right-4 top-4">
                                    {windRad(c.windRad?.ne)}
                                </div>
                                <div className="absolute left-4 bottom-4">
                                    {windRad(c.windRad?.sw)}
                                </div>
                                <div className="absolute right-4 bottom-4">
                                    {windRad(c.windRad?.se)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
