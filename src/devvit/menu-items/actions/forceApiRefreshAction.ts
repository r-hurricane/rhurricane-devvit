/*!
 * Clears the Redis LastModified key and calls the summary API, effectively forcing a data refresh.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {forceApiRefresh} from "../../utils/jobUtils.js";
import {Context} from "@devvit/public-api";

export const forceApiRefreshAction = async (ctx: Context) => {
    await forceApiRefresh(ctx);
    ctx.ui.showToast({
        text: 'Success: API Refreshed',
        appearance: 'success'
    })
};