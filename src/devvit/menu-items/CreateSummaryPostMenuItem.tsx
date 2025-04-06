/*!
 * Adds a subreddit level button to disable and stop the Data Updater scheduled job.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {DataUpdater} from "../jobs/DataUpdater.js";

export class CreateSummaryPostMenuItem {

    public static Register() {
        Devvit.addMenuItem({
            label: 'RHurricane - Create Summary Post',
            location: 'subreddit',
            onPress: async (_, context) => {
                try {
                    // Check the subredditName is not missing, as it is required for SubmitPost to work!
                    if (!context.subredditName) {
                        context.ui.showToast({
                            text: 'ERROR: Context was missing the Subreddit Name? Shouldn\' happen...',
                            appearance: 'neutral'
                        })
                        return;
                    }

                    // Do not allow post creation if data update job is not scheduled
                    if (!DataUpdater.Instance?.getScheduledJob(context.scheduler)) {
                        context.ui.showToast({
                            text: 'ERROR: The Data Updated Job must be started before creating a summary post!',
                            appearance: 'neutral'
                        })
                        return;
                    }

                    // TODO: Check job has run ar least once (i.e. Check redis for the data)

                    // Submit the new post
                    const post = await context.reddit.submitPost({
                        title: 'Tropical Weather Summary',
                        subredditName: context.subredditName,
                        textFallback: {
                            text: 'Interactive posts are unsupported on old.reddit or older app versions.'
                        },
                        preview: (
                            <zstack width='100%' height='100%' alignment="center middle">
                                <vstack width='100%' height='100%' alignment="center middle">
                                    <image
                                        url="loading.gif"
                                        description="Loading ..."
                                        height='170px'
                                        width='170px'
                                        imageHeight='170px'
                                        imageWidth='170px'
                                    />
                                    <spacer size="small" />
                                    <text size="large" weight="bold">
                                        Loading...
                                    </text>
                                </vstack>
                            </zstack>
                        )
                    });

                    // TODO: Save post type to redis

                } catch (ex) {
                    console.error('[Menu - Create Summary] Error creating the summary post:', ex);
                    context.ui.showToast({
                        text: 'ERROR: There was an error creating the summary post.',
                        appearance: 'neutral'
                    });
                }
            }
        });
    }

}