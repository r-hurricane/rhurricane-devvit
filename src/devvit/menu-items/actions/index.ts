/*!
 * Defines the list of actions available via the subreddit menu.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {forceApiRefreshAction} from "./forceApiRefreshAction.js";
import {startDataUpdaterAction} from "./startDataUpdaterAction.js";
import {stopDataUpdaterAction} from "./stopDataUpdaterAction.js";

export const actionMenuActions = {
    'Force-Api-Refresh': forceApiRefreshAction,
    'Start-Data-Updater': startDataUpdaterAction,
    'Stop-Data-Updater': stopDataUpdaterAction
};