/*!
 * Helper method for creating a new Summary Interactive Post.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Logger} from "./Logger";
import {AppSettings, SettingsEnvironment} from "./AppSettings";
import {context, reddit} from "@devvit/web/server";
import {UiResponse} from "@devvit/web/shared";
import * as trackerRedis from "../devvit/redis/trackerRedis";

export const allowRepost = async (logger: Logger): Promise<boolean> => {

    // Get whether post automation is enabled or not
    const allowReposts = await AppSettings.GetAutomatePosts();
    logger.debug('Allow Reposts:', allowReposts);
    if (!allowReposts) return false;

    // Get last repost date
    const lastRepost = await trackerRedis.getSummaryApiLastReposted();
    logger.debug('Last Repost Time:', lastRepost);

    // If last repost time not set, err on the side of caution and set time to now
    if (!lastRepost) {
        await trackerRedis.saveSummaryApiLastReposted(new Date().getTime());
        logger.info('No last repost time saved. Saving now as the last repost time.');
        return false;
    }

    // If last reposted date sooner than 3 hours ago, skip
    const environment = await AppSettings.GetEnvironment();
    const now = new Date().getTime();
    const rateLimit = now - (3 * 3600000);
    if (environment != SettingsEnvironment.Development && lastRepost > rateLimit) {
        logger.debug('Last Repost was within 3 hours. This is the "safety period".');
        return false;
    }

    return true;
};

export const repostIfAtRepostFreq = async (logger: Logger): Promise<boolean> => {

    // Get frequency to repost if no significant changes
    const repostFreq = await AppSettings.GetAutomateRepostFrequency();
    logger.debug('Repost Freq: ', repostFreq);
    if (repostFreq <= 0) return false;

    // Check if last reposted exceeds frequency
    const lastRepost = await trackerRedis.getSummaryApiLastReposted();
    const repostAfter = new Date().getTime() - (repostFreq * 3600000);
    if (!lastRepost || lastRepost > repostAfter) return false;

    // Repost if we have reached the repost frequency
    logger.info('Last repost frequency reached. Reposting!');
    // TODO: Add latest TWO date/time to post title
    const result = await createSummaryPost(
        'Tropical Weather Summary',
        'Tropical Weather Outlook'
    );
    logger.info('Created new update post:', result.showToast, result.navigateTo);
    return true;
};

export const createSummaryPost =
    async (
        title: string,
        flairName?: string | undefined,
        flairText?: string | undefined
    ): Promise<UiResponse> =>
{
    // Create logger
    const logger = await Logger.Create('Create Summary Post');

    try {

        // Check the subredditName is not missing, as it is required for SubmitPost to work!
        if (!context.subredditName) {
            logger.error('Context was missing Subreddit Name?!?');
            return {
                showToast: {
                    text: 'ERROR: Context was missing the Subreddit Name? Shouldn\' happen...',
                    appearance: 'neutral'
                }
            };
        }

        // If a post flair was given, find flair by name
        let flairId: string | undefined = undefined;
        if (flairName) {
            const postFlairs = await reddit.getPostFlairTemplates(context.subredditName);
            flairId = postFlairs.find(f => f.text == flairName)?.id;
            if (!flairId)
                logger.warn(`Unable to find flair named ${flairName}, therefore no post flair will be added.`);
            else
                logger.debug(`Attaching flair ${flairName} (${flairId}) with text "${flairText}"`);
        }

        // Submit the new post
        const post = await reddit.submitCustomPost({
            title: title,
            subredditName: context.subredditName,
            textFallback: {
                text: 'Interactive posts are not supported on old.reddit or older app versions.'
            },
            postData: { type: 'summary' },
            flairId: flairId,
            flairText: flairId ? (flairText ? flairText : flairName) : undefined,

        });
        logger.info(`Successfully created post: ${post.id}`);

        // Confirm post flair set
        if (flairId) {
            await reddit.setPostFlair({
                subredditName: context.subredditName,
                postId: post.id,
                flairTemplateId: flairId,
                text: flairText ?? flairName
            });
        }

        // Save Last Posted date/time as now
        await trackerRedis.saveSummaryApiLastReposted(new Date().getTime());

        // Return result
        return {
            showToast: {
                text: 'Successfully created Summary Post!',
                appearance: 'success'
            },
            navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`
        };

    } catch (ex) {
        logger.error('Error creating the summary post:', ex);
        return {
            showToast: {
                text: 'ERROR: There was an error creating the summary post.',
                appearance: 'neutral'
            }
        };
    }
};