/*!
 * Registers an AppUpdate trigger, which ensures any cron jobs that are enabled are scheduled properly.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {JobController} from "../jobs/JobController.js";
import {Logger} from "../Logger.js";

export class AppUpgradeTrigger {

    public static RegisterTrigger(): void {
        Devvit.addTrigger({
            event: 'AppUpgrade',
            onEvent: async (_, context) => {

                // Create logger
                const logger = await Logger.Create('App Update', context.settings);

                try {

                    for (let j of JobController.Instance.jobList) {
                        await j.onAppUpdate(context);
                    }

                } catch(ex) {
                    logger.error('Error while executing app upgrade trigger', ex);
                }
            }
        });
    }

}
