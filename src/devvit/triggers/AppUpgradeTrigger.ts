/*!
 * Registers an AppUpdate trigger, which ensures any cron jobs that are enabled are scheduled properly.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {JobController} from "../jobs/JobController.js";

export class AppUpgradeTrigger {

    public static RegisterTrigger(): void {
        Devvit.addTrigger({
            event: 'AppUpgrade',
            onEvent: async (_, context) => {
                try {

                    for (let j of JobController.Instance.jobList) {
                        await j.onAppUpdate(context);
                    }

                } catch(ex) {
                    console.error('[AppUpgrade] Error while executing app upgrade trigger', ex);
                }
            }
        });
    }

}
