/*!
 * Registers with Devvit the various Menu Items available to perform actions of the app, such as creat new posts or
 * stop scheduled jobs.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {StartDataUpdaterMenuItem} from "./StartDataUpdater.js";
import {StopDataUpdaterMenuItem} from "./StopDataUpdater.js";
import {CreateSummaryPostMenuItem} from "./CreateSummaryPost.js";

export class MenuRegistrar {

    public static RegisterMenus() {
        StartDataUpdaterMenuItem.Register();
        StopDataUpdaterMenuItem.Register();
        CreateSummaryPostMenuItem.Register();
    }

}