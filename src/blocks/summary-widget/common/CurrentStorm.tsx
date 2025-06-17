/*!
 * Renders an active storm block.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context} from "@devvit/public-api";
import {SummaryCurrentStormData} from "../../../../shared/dtos/redis/summary-api/SummaryApiDtos.js";

export interface CurrentStormProps {
    context: Context;
    storm: SummaryCurrentStormData;
}

const imageForClass = (classification: string, intensity: string) => {
    switch (classification?.toUpperCase()) {
        case "TC": return "high-chance.png";
        case "TD": case "STD": case "STS": return "depression.png";
        case "TS": return "tropical-storm.png";
        case "HU":
            const susWind = parseInt(intensity);
            if (susWind >= 137) return 'cat5.png';
            if (susWind >= 113) return 'cat4.png';
            if (susWind >= 96) return 'cat3.png';
            if (susWind >= 83) return 'cat2.png';
            if (susWind >= 64) return 'cat1.png';
            return "error.png";
    }
    return "post-tropical.png";
};

export const CurrentStorm = (props: CurrentStormProps) => {
    return (
        <hstack
            width="33%"
            alignment="middle start"
            border="thin"
            cornerRadius="medium"
            lightBackgroundColor="PureGray-50"
            darkBackgroundColor="PureGray-900"
            lightBorderColor="PureGray-300"
            darkBorderColor="PureGray-600"
            onPress={() => props.context.ui.navigateTo('https://nhc.noaa.gov')}
        >
            <zstack alignment="center middle">
                <image url={imageForClass(props.storm.classification, props.storm.intensity)} width="30px" height="30px" imageWidth="30px" imageHeight="30px" />
                <text size="xsmall" color="black" weight="bold">{props.storm.intensity}</text>
            </zstack>
            <text size="small">{props.storm.name}</text>
            <spacer size="small" />
        </hstack>
    );
};