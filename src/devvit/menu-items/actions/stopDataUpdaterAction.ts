/*!
 * Adds a subreddit level button to disable and stop the Data Updater scheduled job.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context} from "@devvit/public-api";
import {DataUpdater} from "../../jobs/DataUpdater.js";
import {Logger} from "../../Logger.js";

export const stopDataUpdaterAction = async (context: Context) => {

    // Create logger
    const logger = await Logger.Create('Menu Action - Stop Update', context.settings);

    try {

        // Get update job instance
        const job = DataUpdater.Instance;
        if (!job) {
            context.ui.showToast({
                text: 'ERROR: Unable to locate Data Updater job instance.',
                appearance: 'neutral'
            });
            logger.error('Unable to locate DataUpdater instance.');
            return;
        }

        // Cancel the job if scheduled
        await job.cancelJob(context);

        context.ui.showToast({
            text: 'Data Updater Stopped',
            appearance: 'success'
        })
        logger.info('Successfully stopped DataUpdater job.');

    } catch (ex) {
        logger.error('Error stopping update job:', ex);
        context.ui.showToast({
            text: 'ERROR: There was an error stopping the data updater.',
            appearance: 'neutral'
        });
    }
};