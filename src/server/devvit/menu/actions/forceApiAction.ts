/*!
 * Force API Refresh Menu Action
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Logger} from "../../../util/Logger";
import {Response} from "express";
import {forceDataUpdater} from "../../jobs/dataUpdaterJob";

export const forceApiAction = async (res: Response) => {

    // Create logger
    const logger = await Logger.Create('Menu Action - Force Api Action');
    logger.traceStart("Perform Action");

    try {
        await forceDataUpdater();

        res.status(200).json({
            showToast: {
                text: 'Success: API Refreshed',
                appearance: 'success'
            }
        });
        logger.info('Successfully force refreshed API.');

    } catch (ex) {
        logger.error('Error forcing API refresh: ', ex);
        res.status(500).json({
            showToast: {
                text: 'ERROR: There was an error forcing an API refresh.',
                appearance: 'neutral'
            }
        });
    }

    logger.traceEnd();
};
