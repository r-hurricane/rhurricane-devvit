/*!
* Action to force an API refresh.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Logger} from "../../util/Logger";
import {executeDataUpdate} from "../jobs/dataUpdater";

export const forceApiRefreshAction = async () => {
    const logger = new Logger('Action - Force ApiRefresh');

    // Clear last modified date from redis
    await trackerRedis.saveSummaryApiLastModified('');
    logger.info('Cleared redis lastModified.');

    // Call DataUpdater immediately
    await executeDataUpdate(logger);
    logger.info('Forced API Refresh');
};