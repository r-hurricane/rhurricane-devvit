﻿/*!
 * Renders the Tropical Weather Outlook (TWO) from the summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context} from "@devvit/public-api";
import {IAbxx20AreaOfInterest, TwoData} from "../SummaryApi.js";
import SizeString = Devvit.Blocks.SizeString;

export interface TwoPageProps {
    context: Context;
    two: TwoData | undefined
}


interface TwoStormProps {
    widgetWidth: number;
    storm: IAbxx20AreaOfInterest;
}

const chanceColorScheme = (chance: number) => {
    return chance > 60 ? 'Red' :
        chance >= 40 ? 'YellowOrange' :
            chance > 0 ? 'Yellow' : 'PureGray';
};

const chanceImage = (chance: number) => {
    const name = chance > 60
        ? 'high'
        : chance >= 40
            ? 'medium'
            : 'low';
    return <image
        url={`${name}-chance.png`}
        description={`${name} chance`}
        width="20px"
        height="20px"
        imageWidth="20px"
        imageHeight="20px" />;
};

const AreaOfInterest = (props: TwoStormProps) => {
    const maxChance = Math.max(props.storm.twoDay?.chance ?? 0, props.storm.sevenDay?.chance ?? 0);
    const colorScheme = chanceColorScheme(maxChance);
    return (
        <vstack>
            <spacer size="xsmall" />
            <hstack
                padding="small"
                border="thin"
                cornerRadius="small"
                lightBackgroundColor={colorScheme+'-50'}
                darkBackgroundColor={colorScheme+'-900'}
                lightBorderColor={colorScheme+'-300'}
                darkBorderColor={colorScheme+'-600'}
                gap="small"
            >
                {chanceImage(maxChance)}
                <text width="35px" alignment="middle center">{props.storm.twoDay?.chance ?? 0}%</text>
                <text>|</text>
                <text width="35px" alignment="middle center">{props.storm.sevenDay?.chance ?? 0}%</text>
                <text>|</text>
                <text width={(props.widgetWidth-135)+'px' as SizeString} overflow="ellipsis">{props.storm.id} - {props.storm.title}</text>
            </hstack>
        </vstack>
    );
};

const NoActivityExpected = () => {
    return (
        <vstack>
            <spacer size="xsmall" />
            <hstack
                height="100px"
                alignment="middle center"
                padding="small"
                border="thin"
                cornerRadius="small"
                lightBackgroundColor="PureGray-100"
                backgroundColor="PureGray-800"
                lightBorderColor="PureGray-300"
                darkBorderColor="PureGray-600"
                gap="small"
            >
                <text size="xlarge" width="100%" wrap alignment="middle center">No activity expected in the next 7 days.</text>
            </hstack>
        </vstack>
    );
};

export const TwoPage = (props: TwoPageProps) => {
    // Get dimensions from context
    const widgetWidth = props.context.dimensions?.width ?? 288;

    // Print error if no data provided
    if (!props.two) {
        return (
            <vstack>
                <spacer size="medium" />
                <vstack
                    padding="small"
                    border="thin"
                    lightBackgroundColor="PureGray-100"
                    darkBackgroundColor="PureGray-800"
                    lightBorderColor="PureGray-300"
                    darkBorderColor="PureGray-600"
                    alignment="center middle"
                    cornerRadius="medium"
                >
                    <text
                        weight="bold"
                        size="large"
                        wrap
                    >
                        Failed to load Tropical Weather Outlook. Try again later.
                    </text>
                </vstack>
            </vstack>
        );
    }

    // Get the colors based on the TWO highest chance
    const two = props.two.basins;
    const atlanticMax = two.atlantic.areas.length > 0 ? Math.max(...two.atlantic.areas.map(s => Math.max(s.twoDay?.chance ?? 0, s.sevenDay?.chance ?? 0))) : 0;
    const pacificMax = two.pacific.areas.length > 0 ? Math.max(...two.pacific.areas.map(s => Math.max(s.twoDay?.chance ?? 0, s.sevenDay?.chance ?? 0))) : 0;
    const highestChance = Math.max(atlanticMax, pacificMax);
    const titleColor = chanceColorScheme(highestChance);

    // Get the atlantic and pacific basin summaries
    const atlanticSummary = two.atlantic.areas.length > 0
        ? two.atlantic.areas.map(s => (<AreaOfInterest widgetWidth={widgetWidth} storm={s} />))
        : (<NoActivityExpected />);
    const pacificSummary = two.pacific.areas.length > 0
        ? two.pacific.areas.map(s => (<AreaOfInterest widgetWidth={widgetWidth} storm={s} />))
        : (<NoActivityExpected />);

    return (
        <vstack>
            <spacer size="medium" />
            <vstack
                padding="small"
                border="thin"
                lightBackgroundColor={titleColor+'-100'}
                darkBackgroundColor={titleColor+'-800'}
                lightBorderColor={titleColor+'-300'}
                darkBorderColor={titleColor+'-600'}
                alignment="center middle"
                cornerRadius="medium"
            >
                <text
                    weight="bold"
                    size="large"
                    lightColor={titleColor+'-600'}
                    darkColor={titleColor+'-100'}
                >
                    {widgetWidth < 500 ? 'TWO' : 'Tropical Weather Outlook (TWO)'} - {two.atlantic.issuedOn?.iso ?? ''}
                </text>
                <text size="xsmall">Open Details</text>
            </vstack>
            <spacer size="medium" />
            <hstack>
                <text weight="bold" size="xlarge">Atlantic</text>
            </hstack>
            {atlanticSummary}
            <spacer size="medium" />
            <hstack>
                <text weight="bold" size="xlarge">Pacific</text>
            </hstack>
            {pacificSummary}
        </vstack>
    );
};