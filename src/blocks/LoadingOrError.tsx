/*!
 * A common loading screen.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";

export interface LoadingOrErrorProps {
    message?: string;
    error?: boolean | undefined;
    errorMessage?: string | undefined;
}

export const LoadingOrError = (props: LoadingOrErrorProps) => {
    return (
        <zstack width="100%" height="100%" alignment="center middle">
            <vstack width="100%" height="100%" alignment="center middle">
                <image
                    url={!props.error && !props.errorMessage ? "loading.gif" : "post-tropical.png"}
                    description="Loading..."
                    height="170px"
                    width="170px"
                    imageHeight="170px"
                    imageWidth="170px"
                />
                <spacer size="small" />
                <text size="large" weight="bold" alignment="top center" wrap>
                    {!props.error && !props.errorMessage
                        ? (props.message ?? 'Loading...')
                        : (props.errorMessage ?? 'Sorry, there was an error loading... Please check back soon!')
                    }
                </text>
            </vstack>
        </zstack>
    );
};