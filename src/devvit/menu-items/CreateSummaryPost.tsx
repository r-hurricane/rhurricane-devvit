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
import {isMod} from "../utils/userUtils.js";
import {createSummaryPost} from "../utils/summaryPostUtils.js";

export class CreateSummaryPostMenuItem {

    public static Register() {
        Devvit.addMenuItem({
            forUserType: ['moderator'],
            label: 'RHurricane - Create Summary Post',
            location: 'subreddit',
            onPress: async (_, context) => {

                // Create logger
                const logger = await Logger.Create('Menu - Create Summary', context.settings);
                
                try {
                    // Check user is a mod
                    if (!(await isMod(context))) {
                        context.ui.showToast({
                            text: 'This action requires moderator access.',
                            appearance: 'neutral'
                        });
                        logger.info("User is not a moderator.");
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
                    const result = await createSummaryPost(context);
                    context.ui.showToast(result.toast);
                    if (result.post)
                        context.ui.navigateTo(result.post);

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