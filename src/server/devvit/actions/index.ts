/*!
* Define actions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {forceApiRefreshAction} from "./forceApiRefreshAction";
import {startDataUpdaterAction} from "./startDataUpdaterAction";
import {stopDataUpdaterAction} from "./stopDataUpdaterAction";
import {UiResponse} from "@devvit/web/shared";

export type TActionMenuAction = {
    [key: string]: () => Promise<UiResponse | void>
};

export const actionMenuActions: TActionMenuAction = {
    'Force-Api-Refresh': forceApiRefreshAction,
    'Start-Data-Updater': startDataUpdaterAction,
    'Stop-Data-Updater': stopDataUpdaterAction
};