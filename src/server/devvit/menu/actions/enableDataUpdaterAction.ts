/*!
 * Enable Data Updater Menu Action
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Logger} from "../../../util/Logger";
import {Response} from "express";
import {RedisService} from "../../redis/RedisService";

export const enableDataUpdaterAction = async (res: Response) => {

    // Create logger
    const logger = await Logger.Create('Menu Action - Enable Data Updater Action');
    logger.traceStart("Perform Action");

    try {
        const redis = new RedisService();
        await redis.setRunDataUpdater(true);

        res.status(200).json({
            showToast: {
                text: 'Success: Enabled Data Updater',
                appearance: 'success'
            }
        });
        logger.info('Successfully enabled the Data Updater.');

    } catch (ex) {
        logger.error('Error enabling data updater: ', ex);
        res.status(500).json({
            showToast: {
                text: 'ERROR: There was an error enabling the Data Updater.',
                appearance: 'neutral'
            }
        });
    }

    logger.traceEnd();
};
