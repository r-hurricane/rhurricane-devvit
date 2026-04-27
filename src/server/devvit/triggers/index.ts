/*!
* Register app install and update triggers.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Hono} from 'hono';
import type {OnAppInstallRequest, TriggerResponse} from '@devvit/web/shared';
import {Logger} from "../../util/Logger";
import {isDataUpdaterJobEnabled} from "../redis/trackerRedis";
import {enableDataUpdate} from "../jobs/dataUpdater";
import {forceApiRefreshAction} from "../actions/forceApiRefreshAction";

export const triggers = new Hono();

const onAppUpdateOrInstall = async () => {
    if (!(await isDataUpdaterJobEnabled())) return;
    await enableDataUpdate();
    await forceApiRefreshAction();
};

triggers.post('/on-app-install', async (c) => {
    const logger = await Logger.Create('App Install');

    try {
        await onAppUpdateOrInstall();

        const input = await c.req.json<OnAppInstallRequest>();
        return c.json<TriggerResponse>(
            {
                status: 'success',
                message: `Trigger Complete: ${input.type})`,
            },
            200
        );
    } catch (error) {
        logger.error(`Error in install trigger: `, error);
        return c.json<TriggerResponse>(
            {
                status: 'error',
                message: `Install trigger failed: ${error}`,
            },
            500
        );
    }
});

triggers.post('/on-app-upgrade', async (c) => {
    const logger = await Logger.Create('App Upgrade');

    try {
        await onAppUpdateOrInstall();

        const input = await c.req.json<OnAppInstallRequest>();
        return c.json<TriggerResponse>(
            {
                status: 'success',
                message: `Trigger Complete: ${input.type})`,
            },
            200
        );
    } catch (error) {
        logger.error(`Error in install trigger: `, error);
        return c.json<TriggerResponse>(
            {
                status: 'error',
                message: `Upgrade trigger failed: ${error}`,
            },
            500
        );
    }
});
