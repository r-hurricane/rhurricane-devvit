/*!
 * Registers with Devvit the various Menu Items available to perform actions of the app, such as creat new posts or
 * stop scheduled jobs.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {CreateSummaryPostMenuItem} from "./CreateSummaryPost.js";
import {CommandMenuItem} from "./CommandMenu.js";

export class MenuRegistrar {

    public static RegisterMenus() {
        CommandMenuItem.Register();
        CreateSummaryPostMenuItem.Register();
    }

}