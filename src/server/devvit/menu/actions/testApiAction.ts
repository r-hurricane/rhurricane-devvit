/*!
 * Temporary tester for getting API exception details for documentation for Antboy.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Logger} from "../../../util/Logger";
import {Response} from "express";

export const testApiAction = async (res: Response) => {

    // Create logger
    const logger = await Logger.Create('Menu Action - Test Api Action');
    logger.traceStart("Perform Action");

    try {
        const test = await fetch('https://dev.rhurricane.net/api/v1/errtest');
        logger.info('Got result from api: ', test);

        res.status(200).json({
            showToast: {
                text: 'Success: Disabled Data Updater',
                appearance: 'success'
            }
        });
        logger.info('Successfully disabled the Data Updater.');

    } catch (ex) {
        logger.error('Error disabling the data updater: ', ex,);
        logger.error(typeof ex, Object.keys(ex as Error));
        logger.error('Code: ', ex.code, ' | Details: ', ex.details, ' | Metadata: ', ex.metadata);
        res.status(500).json({
            showToast: {
                text: 'ERROR: There was an error disabling the Data Updater.',
                appearance: 'neutral'
            }
        });
    }

    logger.traceEnd();
};
