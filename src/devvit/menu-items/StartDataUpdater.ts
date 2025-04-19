/*!
 * Adds a subreddit level button to enable and start the Data Updater scheduled job.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {DataUpdater} from "../jobs/DataUpdater.js";
import {Logger} from "../Logger.js";

export class StartDataUpdaterMenuItem {

    public static Register() {
        Devvit.addMenuItem({
            label: 'RHurricane - Start Data Updater',
            location: 'subreddit',
            onPress: async (_, context) => {

                // Create logger
                const logger = await Logger.Create('Menu - Start Update', context.settings);

                try {
                    // Get the data update job instance
                    const job = DataUpdater.Instance;
                    if (!job) {
                        context.ui.showToast({
                            text: 'ERROR: Unable to locate Data Updater job instance.',
                            appearance: 'neutral'
                        });
                        logger.error('Unable to locate DataUpdater instance.');
                        return;
                    }

                    // Schedule the job (it checks if already scheduled)
                    await job.scheduleCronJob(context);

                    context.ui.showToast({
                        text: 'Data Updater Started',
                        appearance: 'success'
                    })
                    logger.info('Successfully started DataUpdater job.');

                } catch (ex) {
                    logger.error('Error scheduling update job:', ex);
                    context.ui.showToast({
                        text: 'ERROR: There was an error starting the data updater.',
                        appearance: 'neutral'
                    });
                }
            }
        });
    }

}