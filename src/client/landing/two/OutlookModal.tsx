/*!
* Component that shows details of an outlook AOI.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {TwoAreaOfInterest} from "../../../shared/dtos/redis/summary-api/SummaryApiTwoDtos";
import {OutlookCardStyle} from "./OutlookCardStyle";
import {useLandingContext} from "../LandingContext";
import {HiXMark} from "react-icons/hi2";

export const OutlookModal = ({
    area,
    style
}: {
    area: TwoAreaOfInterest;
    style: OutlookCardStyle;
}) => {
    const {setModal} = useLandingContext();
    const closeModal = () => {
        setModal(undefined);
    };
    return (
        <div
            className="z-50 fixed inset-0 w-full h-full flex justify-center items-center bg-black/50"
            onClick={closeModal}
        >
            <div
                className={`relative w-[calc(100vw-16px)] max-h-[calc(100vh-40px)] min-h-[200px] 
                flex flex-col justify-between rounded-md
                ${style.background}
                border-1 ${style.border}
                text-xs
                `}
            >
                <button className={`absolute -top-2 -right-2 cursor-pointer ${style.background} rounded-full border-1 ${style.border}`}>
                    <HiXMark className="size-6" />
                </button>
                <div className="h-full flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className={`p-2 border-b ${style.border}`}>
                        <div className={style.text}>
                            <strong>{Math.floor(area.twoDay?.chance ?? 0)}%</strong> (48h) |&nbsp;
                            <strong>{Math.floor(area.sevenDay?.chance ?? 0)}%</strong> (7d)
                        </div>
                        <div>{area.title}</div>
                    </div>
                    {/*TODO: Graphics*/}
                    {/*<div className="w-full h-25 min-h-25"></div>*/}
                    <div className={`flex-1 min-h-0 p-2`}>
                        {area.text}
                    </div>
                </div>
            </div>
        </div>
    );
};
