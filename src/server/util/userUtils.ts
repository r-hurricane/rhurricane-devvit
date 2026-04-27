/*!
 * Various helper methods for user related actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {reddit, context, User} from "@devvit/web/server";

export const isMod = async (user?: User): Promise<boolean> => {
    user = user ?? await reddit.getCurrentUser();
    if (!user || !context.subredditName) return false;
    const modPermissions = await user.getModPermissionsForSubreddit(context.subredditName);
    return modPermissions.some(p => p === 'all' || p === 'posts' || p === 'config');
};