/*!
 * Footer to display disclaimer + settings.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {HiMiniCog6Tooth, HiMiniExclamationCircle} from "react-icons/hi2";
import {DisclaimerModal} from "./general/DisclaimerModal";
import {useLandingContext} from "./LandingContext";
import {SettingsModal} from "./general/SettingsModal";

export const Footer = () => {
    const {data, setModal} = useLandingContext();
    return (
        <div className="px-2 py-1 flex justify-between items-center border-t border-puregray-200 dark:border-puregray-700 bg-puregray-50 dark:bg-puregray-900">
            <button
                onClick={() => setModal(<DisclaimerModal />)}
                className="px-2 py-1 flex gap-1 justify-center items-center cursor-pointer rounded-full bg-puregray-200 dark:bg-puregray-700"
            >
                <HiMiniExclamationCircle className="size-4" />
                <span>Disclaimer</span>
            </button>
            {data?.isDev === true && (<div className="text-red-500 font-bold">SAMPLE DATA</div>)}
            <button
                onClick={() => setModal(<SettingsModal />)}
                className="px-2 py-1 flex gap-1 justify-center items-center cursor-pointer rounded-full bg-puregray-200 dark:bg-puregray-700"
            >
                <HiMiniCog6Tooth className="size-4" />
                <span>Settings</span>
            </button>
        </div>
    );
};