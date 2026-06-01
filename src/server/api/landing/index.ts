/*!
* Define API routes for landing view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Hono} from "hono";
import {ApiErrorResponse, LandingInitResponse} from "../../../shared/api";
import {Logger} from "../../util/Logger";
import {AppSettings, MaintenanceLevel, SettingsEnvironment} from "../../util/AppSettings";
import {context} from "@devvit/web/server";
import * as trackerRedis from "../../devvit/redis/trackerRedis";

export const landing = new Hono();

landing.get('/init', async (c) => {
    const logger = await Logger.Create('Landing - Init');
    try {
        // Get API last modified
        const lastMod = await trackerRedis.getSummaryApiLastModified();
        if (!lastMod)
            throw new Error('Failed to load LastModified from Redis.');

        // Fail if not a valid date string
        const date = new Date(lastMod);
        if (!date || isNaN(date.getTime()))
            throw new Error(`LastModified date of ${lastMod} was invalid`);

        // Check last modified is < {setting} hours ago
        const staleSetting = await AppSettings.GetStaleHours();
        const saleTime = new Date().getTime() - staleSetting * 3600000;
        if (date.getTime() < saleTime)
            throw new Error(`API Data is stale, last modified at ${lastMod} which is over ${staleSetting} hours ago!`);

        // Get whether is the development data environment or not
        const isDev = (await AppSettings.GetEnvironment()) !== SettingsEnvironment.Production;
        const maintenanceMode = MaintenanceLevel[await AppSettings.GetMaintenanceMode()] as LandingInitResponse['maintenanceMode'];
        const maintenanceMessage = await AppSettings.GetMaintenanceModeMessage();

        // Fetch the actual summary data!
        const summaryApiData = await trackerRedis.getSummaryApiData();

        // And user preferences
        const userPreferences = context.userId
            ? await trackerRedis.getUserPreferences(context.userId)
            : null;

        return c.json<LandingInitResponse>({ isDev, summaryApiData, maintenanceMode, maintenanceMessage, userPreferences }, 200);

    } catch (error) {
        logger.error('Error with init API: ', error);
        return c.json<ApiErrorResponse>({error: 'Error getting outlook data'}, 500);
    }
});