/*!
 * Create Summary Post Menu Action
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Logger} from "../../../util/Logger";
import {Response} from "express";
import {AppSettings} from "../../../util/AppSettings";
import {RedisService} from "../../redis/RedisService";
import { createSummaryPost } from "../../../util/summaryPostUtils";

export const createSummaryPostAction = async (res: Response) => {

    // Create logger
    const logger = await Logger.Create('Menu Action - Create Summary Post Action');
    logger.traceStart("Perform Action");

    try {

        // Do not allow post creation if data update job is not scheduled
        const redis = new RedisService();
        if (!(await redis.getRunDataUpdater()))
        {
            logger.error('The Data Update job is not currently running.');
            res.status(400).json({
                showToast: {
                    text: 'ERROR: You must start the data updater before creating a summary post.',
                    appearance: 'neutral'
                }
            });
            return;
        }

        // Check redis to ensure data exists and is not stale/old (i.e. last modified < 24 hours)
        const lastModified = await redis.getSummaryApiLastModified();
        const staleSetting = await AppSettings.GetStaleHours();
        const saleTime = new Date().getTime() - staleSetting * 3600000;
        if (!lastModified || new Date(lastModified).getTime() < saleTime) {
            logger.error(`Stale data detected! Last update was ${lastModified} which was over ${staleSetting} hours ago!`);
            res.status(400).json({
                showToast: {
                    text: 'ERROR: The Data Update job has not yet run!',
                    appearance: 'neutral'
                }
            });
            return;
        }

        // Submit the new post
        const result = await createSummaryPost('Tropical Weather Summary');

        // Send response
        res.status(200).json({
            showToast: {
                text: result.toast.text,
                appearance: result.toast.appearance
            },
            navigateTo: result.post
        });

        logger.info('Successfully created summary post.');

    } catch (ex) {
        logger.error('Error creating summary post: ', ex);
        res.status(500).json({
            showToast: {
                text: 'ERROR: There was an error while creating summary post.',
                appearance: 'neutral'
            }
        });
    }

    logger.traceEnd();
};
