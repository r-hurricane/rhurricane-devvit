/*!
* Register scheduler job handlers.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { Hono } from 'hono';
import { type TaskResponse } from '@devvit/web/server'
import {Logger} from "../../util/Logger";
import {executeDataUpdate} from "./dataUpdater";

export const jobs = new Hono();

jobs.post('/data-updater', async (c) => {
    const logger = await Logger.Create('Jobs - Data Updater');

    try {

        await executeDataUpdate(logger);
        return c.json<TaskResponse>(
            {
                status: 'success',
                message: 'Job ran successfully'
            },
            200
        );

    } catch (error) {

        logger.error(`Job failed: `, error);
        return c.json<TaskResponse>(
            {
                status: 'error',
                message: `Job failed: ${error}`,
            },
            500
        );
    }
});
