/*!
 * Helper method for creating a new Summary Interactive Post.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {JobContext, Context, Toast, Post, Devvit, SettingsClient} from "@devvit/public-api";
import {Logger} from "../Logger.js";
import {RedisService} from "../redis/RedisService.js";
import {AppSettings} from "../AppSettings.js";

export const allowRepost = async (logger: Logger, settings: SettingsClient, redis: RedisService): Promise<boolean> => {

    // Get whether post automation is enabled or not
    const allowReposts = await AppSettings.GetAutomatePosts(settings);
    logger.debug('Allow Reposts:', allowReposts);
    if (!allowReposts) return false;

    // Get last repost date
    const lastRepost = await redis.getSummaryApiLastReposted();
    logger.debug('Last Repost Time:', lastRepost);

    // If last repost time not set, err on the side of caution and set time to now
    if (!lastRepost) {
        await redis.saveSummaryApiLastReposted(new Date().getTime());
        logger.info('No last repost time saved. Saving now as the last repost time.');
        return false;
    }

    // If last reposted date sooner than 3 hours ago, skip
    const now = new Date().getTime();
    const rateLimit = now - (3 * 3600000);
    if (lastRepost > rateLimit) {
        logger.debug('Last Repost was within 3 hours. This is the "safety period".');
        return false;
    }

    return true;
};

export const repostIfAtRepostFreq = async (logger: Logger, jobContext: JobContext): Promise<boolean> => {

    // Get frequency to repost if no significant changes
    const repostFreq = await AppSettings.GetAutomateRepostFrequency(jobContext.settings);
    logger.debug('Repost Freq: ', repostFreq);
    if (repostFreq <= 0) return false;

    // Check if last reposted exceeds frequency
    const redis = new RedisService(jobContext.redis);
    const lastRepost = await redis.getSummaryApiLastReposted();
    const repostAfter = new Date().getTime() - (repostFreq * 3600000);
    if (!lastRepost || lastRepost > repostAfter) return false;

    // Repost if we have reached the repost frequency
    logger.info('Last repost frequency reached. Reposting!');
    // TODO: Add Update Flair
    const result = await createSummaryPost(jobContext);
    logger.info('Reposted new post:', result.toast.text, result.post?.id);
    return true;
};

export type CreateSummaryResult = { toast: Toast, post?: Post };

export const createSummaryPost = async (context: Context | JobContext): Promise<CreateSummaryResult> => {
    // Create logger
    const logger = await Logger.Create('Create Summary Post', context.settings);

    try {

        // Check the subredditName is not missing, as it is required for SubmitPost to work!
        if (!context.subredditName) {
            logger.error('Context was missing Subreddit Name?!?');
            return {
                toast: {
                    text: 'ERROR: Context was missing the Subreddit Name? Shouldn\' happen...',
                    appearance: 'neutral'
                }
            };
        }

        // Submit the new post
        const post = await context.reddit.submitPost({
            title: 'Tropical Weather Summary',
            subredditName: context.subredditName,
            textFallback: {
                text: 'Interactive posts are unsupported on old.reddit or older app versions.'
            },
            // TODO: flairId: flairId,
            // TODO: flairText: flairText,
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
        const redis = new RedisService(context.redis);
        await redis.savePostMetadata(post.id, { type: 'summary' });

        // Save Last Posted date/time as now
        await redis.saveSummaryApiLastReposted(new Date().getTime());

        // Return result
        return {
            toast: {
                text: 'Successfully created Summary Post!',
                appearance: 'success'
            },
            post: post
        };

    } catch (ex) {
        logger.error('Error creating the summary post:', ex);
        return {
            toast: {
                text: 'ERROR: There was an error creating the summary post.',
                appearance: 'neutral'
            }
        };
    }
};