/*!
 * Disable Data Updater Menu Action
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Logger} from "../../../util/Logger";
import {Response} from "express";
import {RedisService} from "../../redis/RedisService";

export const disableDataUpdaterAction = async (res: Response) => {

    // Create logger
    const logger = await Logger.Create('Menu Action - Disable Data Updater Action');
    logger.traceStart("Perform Action");

    try {
        const redis = new RedisService();
        await redis.setRunDataUpdater(false);

        res.status(200).json({
            showToast: {
                text: 'Success: Disabled Data Updater',
                appearance: 'success'
            }
        });
        logger.info('Successfully disabled the Data Updater.');

    } catch (ex) {
        logger.error('Error disabling the data updater: ', ex);
        res.status(500).json({
            showToast: {
                text: 'ERROR: There was an error disabling the Data Updater.',
                appearance: 'neutral'
            }
        });
    }

    logger.traceEnd();
};
