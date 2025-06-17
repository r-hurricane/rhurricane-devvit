/*!
 * Renders the Tropical Weather Outlook (TWO) from the summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context, useState} from "@devvit/public-api";
import {TwoAreaOfInterest, TwoData} from "../../../../shared/dtos/redis/summary-api/SummaryApiTwoDtos.js";
import SizeString = Devvit.Blocks.SizeString;
import {NoDetails} from "../common/NoDetails.js";
import {Container} from "../common/Container.js";
import {formatDate} from "../../../../shared/render/formatDate.js";

// Helper function to get the color scheme for the header and area of interest (AOI) color
const chanceColorScheme = (chance: number) => {
    return chance > 60 ? 'Red' :
        chance >= 40 ? 'YellowOrange' :
            chance > 0 ? 'Yellow' : 'PureGray';
};

// Helper to get the AOI X icon
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

// Renders the chances and heading for each tracked Area of Interest (AOI)
interface TwoStormProps {
    widgetWidth: number;
    storm: TwoAreaOfInterest;
}

const AreaOfInterest = (props: TwoStormProps) => {
    const maxChance = Math.max(props.storm.twoDay?.chance ?? 0, props.storm.sevenDay?.chance ?? 0);
    const colorScheme = chanceColorScheme(maxChance);
    const [showDetail, setShowDetail] = useState(false);
    return (
        <vstack width="100%">
            <spacer size="xsmall" />
            <vstack
                width="100%"
                padding="xsmall"
                border="thin"
                cornerRadius="small"
                lightBackgroundColor={colorScheme+'-50'}
                darkBackgroundColor={colorScheme+'-900'}
                lightBorderColor={colorScheme+'-300'}
                darkBorderColor={colorScheme+'-600'}
            >
                <hstack width="100%" onPress={() => setShowDetail(!showDetail)}>
                    {chanceImage(maxChance)}
                    <text width="35px" alignment="middle center">{props.storm.twoDay?.chance ?? 0}%</text>
                    <text>|</text>
                    <text width="35px" alignment="middle center">{props.storm.sevenDay?.chance ?? 0}%</text>
                    <text>|</text>
                    <spacer size="xsmall" />
                    <text width={(props.widgetWidth-135)+'px' as SizeString} overflow="ellipsis">
                        {!!props.storm.id && props.storm.id.length > 0 ? props.storm.id + ' - ' : ''}
                        {props.storm.title}
                    </text>
                </hstack>
                {showDetail && (
                    <vstack width="100%">
                        <spacer size="xsmall" />
                        <hstack width="100%" height="1px" lightBackgroundColor="Global-Black" darkBackgroundColor="Global-White" />
                        <spacer size="xsmall" />
                        <text wrap>{props.storm.text ?? ''}</text>
                    </vstack>
                )}
            </vstack>
        </vstack>
    );
};

// Renders the no activity message
const NoActivityExpected = () => {
    return (
        <vstack>
            <spacer size="xsmall" />
            <NoDetails>No formation expected in the next 7 days.</NoDetails>
        </vstack>
    );
};

// Renders the Tropical Weather Outlook data
export interface TwoPageProps {
    context: Context;
    two: TwoData | undefined
}

export const TwoPage = (props: TwoPageProps) => {
    // Get dimensions from context
    const widgetWidth = props.context.dimensions?.width ?? 288;

    // Print error if no data provided
    if (!props.two) {
        return (
            <NoDetails weight="bold">Failed to load Tropical Weather Outlook. Try again later.</NoDetails>
        );
    }

    // Get the TWO data
    const two = props.two.basins;

    // Get the atlantic and pacific basin summaries
    const atlanticSummary = two.atlantic.areas.length > 0
        ? two.atlantic.areas.map(s => (<AreaOfInterest widgetWidth={widgetWidth} storm={s} />))
        : (<NoActivityExpected />);
    const pacificSummary = two.pacific.areas.length > 0
        ? two.pacific.areas.map(s => (<AreaOfInterest widgetWidth={widgetWidth} storm={s} />))
        : (<NoActivityExpected />);

    return (
        <vstack width="100%" gap="small">
            <Container alignment="middle center">
                <text weight="bold" size="medium">
                    {
                        widgetWidth < 500
                            ? 'Tropical Outlook (TWO)'
                            : 'Tropical Weather Outlook (TWO)'
                    }
                </text>
                <text size="small">{formatDate(two.atlantic.issuedOn?.time)}</text>
                {/* Temporarily remove webview note, until webview is added */}
                {/*<text size="xsmall">Open Details</text>*/}
            </Container>
            <vstack width="100%">
                <hstack>
                    <text weight="bold" size="medium">Atlantic</text>
                </hstack>
                {atlanticSummary}
            </vstack>
            <vstack width="100%">
                <hstack>
                    <text weight="bold" size="medium">Pacific</text>
                </hstack>
                {pacificSummary}
            </vstack>
        </vstack>
    );
};