/*!
 * Helper method for triggering a forced API update (i.e. delete last modified key + fetch immediately)
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {JobContext} from "@devvit/public-api";
import {DataUpdater} from "../jobs/DataUpdater.js";
import {RedisService} from "../redis/RedisService.js";
import {Logger} from '../Logger.js';

export const forceApiRefresh = async (context: JobContext) => {

    const logger = await Logger.Create('Force Api Refresh', context.settings);

    // Clear last modified date from redis
    const redis = new RedisService(context.redis);
    await redis.saveSummaryApiLastModified('');
    logger.info('Cleared redis lastModified.');

    // Call DataUpdater immediately
    await DataUpdater.Instance?.onRun({name: 'Force Refresh', data: undefined}, context);
    logger.info('Forced API Refresh');
};