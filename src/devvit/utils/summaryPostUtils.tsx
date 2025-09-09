/*!
 * Helper method for creating a new Summary Interactive Post.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context, Devvit, JobContext, Post, SettingsClient, Toast} from "@devvit/public-api";
import {Logger} from "../Logger.js";
import {RedisService} from "../redis/RedisService.js";
import {AppSettings, SettingsEnvironment} from "../AppSettings.js";

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
    const environment = await AppSettings.GetEnvironment(settings);
    const now = new Date().getTime();
    const rateLimit = now - (3 * 3600000);
    if (environment != SettingsEnvironment.Development && lastRepost > rateLimit) {
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
    // TODO: Add latest TWO date/time to post title
    const result = await createSummaryPost(jobContext,
        'Tropical Weather Summary',
        'Tropical Weather Outlook'
    );
    logger.info('Created new update post:', result.toast.text, result.post?.id);
    return true;
};

export type CreateSummaryResult = { toast: Toast, post?: Post };

export const createSummaryPost =
    async (
        context: Context | JobContext,
        title: string,
        flairName?: string | undefined,
        flairText?: string | undefined
    ): Promise<CreateSummaryResult> =>
{
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

        // If a post flair was given, find flair by name
        let flairId: string | undefined = undefined;
        if (flairName) {
            const postFlairs = await context.reddit.getPostFlairTemplates(context.subredditName);
            flairId = postFlairs.find(f => f.text == flairName)?.id;
            if (!flairId)
                logger.warn(`Unable to find flair named ${flairName}, therefore no post flair will be added.`);
            else
                logger.debug(`Attaching flair ${flairName} (${flairId}) with text \"${flairText}\"`);
        }

        // Submit the new post
        const post = await context.reddit.submitPost({
            title: title,
            subredditName: context.subredditName,
            textFallback: {
                text: 'Interactive posts are unsupported on old.reddit or older app versions.'
            },
            flairId: flairId,
            flairText: flairId ? (flairText ? flairText : flairName) : undefined,
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

        // Confirm post flair set
        if (flairId) {
            await context.reddit.setPostFlair({
                subredditName: context.subredditName,
                postId: post.id,
                flairTemplateId: flairId,
                text: flairText ?? flairName
            });
        }

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