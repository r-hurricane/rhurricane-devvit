/*!
 * Defines the list of actions available via the subreddit menu.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {forceApiAction} from "./forceApiAction";
import {Response} from "express";
import {enableDataUpdaterAction} from "./enableDataUpdaterAction";
import {disableDataUpdaterAction} from "./disableDataUpdaterAction";
import {createSummaryPostAction} from "./createSummaryPostAction";
import {testApiAction} from "./testApiAction";

export type TActionMenuAction = {
    [key: string]: (resp: Response) => Promise<void>
};

export const actionMenuActions: TActionMenuAction = {
    'Force-Refresh-Action': forceApiAction,
    'Enable-DataUpdate-Action': enableDataUpdaterAction,
    'Disable-DataUpdate-Action': disableDataUpdaterAction,
    'Create-Post-Action': createSummaryPostAction,
    'Test-Api-Action': testApiAction
};
