/*!
 * Adds a subreddit level button to enable and start the Data Updater scheduled job.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {DataUpdater} from "../jobs/DataUpdater.js";

export class StartDataUpdaterMenuItem {

    public static Register() {
        Devvit.addMenuItem({
            label: 'RHurricane - Start Data Updater',
            location: 'subreddit',
            onPress: async (_, context) => {
                try {
                    const job = DataUpdater.Instance;
                    if (!job) {
                        context.ui.showToast({
                            text: 'ERROR: Unable to locate Data Updater job instance.',
                            appearance: 'neutral'
                        });
                        console.error('[Menu - Start] Unable to locate DataUpdater instance.');
                        return;
                    }

                    await job.scheduleCronJob(context);

                    context.ui.showToast({
                        text: 'Data Updater Started',
                        appearance: 'success'
                    })
                    console.log('[Menu - Start] Successfully started DataUpdater job.');

                } catch (ex) {
                    console.error('[Menu - Start] Error scheduling update job:', ex);
                    context.ui.showToast({
                        text: 'ERROR: There was an error starting the data updater.',
                        appearance: 'neutral'
                    });
                }
            }
        });
    }

}