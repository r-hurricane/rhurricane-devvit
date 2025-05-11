/*!
 * Various helper methods for user related actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context} from "@devvit/public-api";

export const isMod = async (context: Context) => {
    const user = await context.reddit.getCurrentUser();
    if (!user || !context.subredditName) return false;
    const modPermissions = await user.getModPermissionsForSubreddit(context.subredditName);
    return modPermissions.length > 0;
};