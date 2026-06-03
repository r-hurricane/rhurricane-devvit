/*!
 * Modal that displays the data disclaimer.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {HiMiniArrowTopRightOnSquare} from "react-icons/hi2";
import {navigateTo} from '@devvit/web/client';
import {useLandingContext} from "../LandingContext";

export const DisclaimerModal = () => {
    const {setModal} = useLandingContext();
    return (
        <div className="z-50 fixed inset-0 w-full h-full p-4 text-xs flex flex-col gap-2 bg-white dark:bg-puregray-950 text-neutral-content">
            <h2 className="text-lg font-bold border-b">Data Disclaimer</h2>
            <p className="text-danger-plain text-base font-bold">This app is is NOT an official government app and therefore should not be used for any decisions pertaining to your safety or security!</p>
            <p>Please visit official government channels for the most accurate information and warnings:</p>
            <button
                onClick={() => navigateTo("https://nhc.noaa.gov")}
                className="p-2 flex gap-1 justify-center items-center cursor-pointer rounded-full bg-puregray-200 dark:bg-puregray-700"
            >
                <HiMiniArrowTopRightOnSquare className="size-4" />
                <span>National Hurricane Center (NHC)</span>
            </button>
            <button
                onClick={() => navigateTo("https://www.metoc.navy.mil/jtwc/jtwc.html")}
                className="p-2 flex gap-1 justify-center items-center cursor-pointer rounded-full bg-puregray-200 dark:bg-puregray-700"
            >
                <HiMiniArrowTopRightOnSquare className="size-4" />
                <span>Joint Typhoon Warning Center (JTWC)</span>
            </button>
            <p>Data obtained from the National Hurricane Center (NHC) and National Weather Service (NWS).</p>
            <p>This app does not track you, but your user ID (not name) may be used to save your preferences.</p>
            <p>Developed and maintained by u/Beach-Brews.</p>
            <button
                onClick={() => setModal(undefined)}
                className="p-2 flex gap-1 justify-center items-center cursor-pointer rounded-full text-white bg-alienblue-700"
            >
                Acknowledged
            </button>
        </div>
    );
};