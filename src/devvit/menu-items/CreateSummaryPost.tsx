/*!
 * Adds a subreddit level button to disable and stop the Data Updater scheduled job.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {DataUpdater} from "../jobs/DataUpdater.js";
import {RedisService} from "../redis/RedisService.js";
import {AppSettings} from "../AppSettings.js";
import {Logger} from "../Logger.js";

export class CreateSummaryPostMenuItem {

    public static Register() {
        Devvit.addMenuItem({
            label: 'RHurricane - Create Summary Post',
            location: 'subreddit',
            onPress: async (_, context) => {

                // Create logger
                const logger = await Logger.Create('Menu - Create Summary', context.settings);
                
                try {
                    // Check the subredditName is not missing, as it is required for SubmitPost to work!
                    if (!context.subredditName) {
                        logger.error('Context was missing Subreddit Name?!?');
                        context.ui.showToast({
                            text: 'ERROR: Context was missing the Subreddit Name? Shouldn\' happen...',
                            appearance: 'neutral'
                        });
                        return;
                    }

                    // Do not allow post creation if data update job is not scheduled
                    const dataJob = DataUpdater.Instance;
                    if (!dataJob ||
                        !(await dataJob.getScheduledJob(context.scheduler)) ||
                        !(await dataJob.isEnabled(context.redis)))
                    {
                        logger.error('The Data Update job is not currently running.');
                        context.ui.showToast({
                            text: 'ERROR: The Data Updated Job must be started before creating a summary post!',
                            appearance: 'neutral'
                        });
                        return;
                    }

                    // Check redis to ensure data exists and is not stale/old (i.e. last modified < 24 hours)
                    const redis = new RedisService(context.redis);
                    const lastModified = await redis.getSummaryApiLastModified();
                    const staleSetting = await AppSettings.GetStaleHours(context.settings);
                    const saleTime = new Date().getTime() - staleSetting * 3600000;
                    if (!lastModified || new Date(lastModified).getTime() < saleTime) {
                        logger.error(`Stale data detected! Last update was ${lastModified} which was over ${staleSetting} hours ago!`);
                        context.ui.showToast({
                            text: 'ERROR: The Data Update job has not yet run!',
                            appearance: 'neutral'
                        });
                        return;
                    }

                    // Submit the new post
                    const post = await context.reddit.submitPost({
                        title: 'Tropical Weather Summary',
                        subredditName: context.subredditName,
                        textFallback: {
                            text: 'Interactive posts are unsupported on old.reddit or older app versions.'
                        },
                        preview: (
                            <zstack width="100%" height="100%" alignment="center middle">
                                <vstack width="100%" height="100%" alignment="center middle">
                                    <image
                                        url="loading.gif"
                                        description="Loading ..."
                                        height="170px"
                                        width="170px"
                                        imageHeight="170px"
                                        imageWidth="170px"
                                    />
                                    <spacer size="small" />
                                    <text size="large" weight="bold">
                                        Loading...
                                    </text>
                                </vstack>
                            </zstack>
                        )
                    });
                    logger.info(`Successfully created post: ${post.id}`);

                    // Save post type to redis
                    await redis.savePostMetadata(post.id, { type: 'summary' });

                    // Show success message
                    context.ui.showToast({
                        text: 'Successfully created Summary Post!',
                        appearance: 'success'
                    });

                    // Redirect to new post!
                    context.ui.navigateTo(post);

                } catch (ex) {
                    logger.error('Error creating the summary post:', ex);
                    context.ui.showToast({
                        text: 'ERROR: There was an error creating the summary post.',
                        appearance: 'neutral'
                    });
                }
            }
        });
    }

}