/*!
 * Registers all paths to internal devvit actions (like menus, triggers and scheduler tasks).
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from "../PathFactory";
import { Router } from "express";
import { registerActionMenu } from "./menu/actionMenu";
import { registerActionMenuForm } from "./menu/actionMenuForm";
import {registerDataUpdaterJob} from "./jobs/dataUpdaterJob";
import {registerInstallTrigger, registerUpdateTrigger} from "./triggers/appInstallUpdateTrigger";

export const registerInternalRoutes: PathFactory = (router: Router) => {
    registerActionMenu(router);
    registerActionMenuForm(router);

    registerDataUpdaterJob(router);

    registerInstallTrigger(router);
    registerUpdateTrigger(router);
};
