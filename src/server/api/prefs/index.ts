/*!
* Define API routes for user preferences.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Hono} from "hono";
import {ApiErrorResponse} from "../../../shared/api";
import {Logger} from "../../util/Logger";
import {context} from "@devvit/web/server";
import { zValidator } from '@hono/zod-validator';
import * as trackerRedis from "../../devvit/redis/trackerRedis";
import {UserPreferencesSchema} from "../../devvit/redis/schemas/UserPreferencesSchema";

export const prefs = new Hono();

prefs.post('/', zValidator('json', UserPreferencesSchema), async (c) => {
    const logger = await Logger.Create('User Prefs');
    try {
        const userId = context.userId;
        if (!userId) {
            throw new Error('User unknown');
        }

        const prefs = c.req.valid('json');
        await trackerRedis.saveUserPreferences(userId, prefs);
        return c.json<boolean>(true, 200);

    } catch (error) {
        logger.error('Error saving user preferences: ', error);
        return c.json<ApiErrorResponse>({error: 'Error saving user preferences'}, 500);
    }
});