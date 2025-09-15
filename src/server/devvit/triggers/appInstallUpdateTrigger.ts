/*!
 * Registers a route for triggering a force API refresh on app install + update.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from "../../PathFactory";
import { Router } from "express";
import { Logger } from "../../util/Logger";
import {forceDataUpdater} from "../jobs/dataUpdaterJob";

export const APP_INSTALL_TRIGGER_PATH = '/internal/trigger/install';
export const APP_UPDATE_TRIGGER_PATH = '/internal/trigger/update';

export const registerInstallTrigger: PathFactory = (router: Router) => {
    router.post(APP_INSTALL_TRIGGER_PATH, async (_req, _resp) => {
        // Create logger
        const logger = await Logger.Create('App Install');

        try {
            // No Action right now
        } catch(ex) {
            logger.error('Error while executing app upgrade trigger', ex);
        }
    });
};
export const registerUpdateTrigger: PathFactory = (router: Router) => {
    router.post(APP_UPDATE_TRIGGER_PATH, async (_req, _resp) => {
        // Create logger
        const logger = await Logger.Create('App Update');

        try {
            // Trigger forced API call
            await forceDataUpdater();
        } catch(ex) {
            logger.error('Error while executing app upgrade trigger', ex);
        }
    });
};
