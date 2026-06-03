/*!
 * Rendering a specific storm summary.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SummaryCurrentStormData} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos";
import {navigateTo} from "@devvit/web/client";
import {speedString} from "../../shared/unitConversion";
import {useLandingContext} from "../LandingContext";

const imageForClass = (classification: string, intensity: string) => {
    switch (classification?.toUpperCase()) {
        case "PC": return "high-chance.png";
        case "TD": case "STD": return "depression.png";
        case "TS": case "STS": return "tropical-storm.png";
        case "HU":
        {
            const susWind = parseInt(intensity);
            if (susWind >= 137) return 'cat5.png';
            if (susWind >= 113) return 'cat4.png';
            if (susWind >= 96) return 'cat3.png';
            if (susWind >= 83) return 'cat2.png';
            if (susWind >= 64) return 'cat1.png';
            return "tropical-storm.png";
        }
    }
    return "post-tropical.png";
};

export const CurrentStorm = ({
    storm
}: {
    storm: SummaryCurrentStormData
}) => {
    const { data } = useLandingContext();
    return (
        <button
            onClick={() => navigateTo('https://nhc.noaa.gov')}
            className="w-1/3 flex items-center cursor-pointer border rounded-md border-puregray-300 dark:border-puregray-600 bg-puregray-50 dark:bg-puregray-900"
        >
            <div className="relative">
                <img src={imageForClass(storm.classification, storm.intensity)} alt="storm icon" width="30px" height="30px" className="size-[30px]" />
                <span className="text-xs text-black font-bold absolute z-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{speedString(storm.intensity, data?.userPreferences?.speed ?? 'kts', false)}</span>
            </div>
            <span className="text-sm">{storm.binNumber.substring(0, 2).toUpperCase()} - {storm.name}</span>
        </button>
    );
};