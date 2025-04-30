/*!
 * The start of it all! Configures the required Devvit components, then registers all components.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from '@devvit/public-api';
import {AppSettings} from "./AppSettings.js";
import {JobController} from "./jobs/JobController.js";
import {AppUpgradeTrigger} from "./triggers/AppUpgradeTrigger.js";
import {MenuRegistrar} from "./menu-items/MenuRegistrar.js";
import {registerCustomPostType} from "../blocks/CustomPostType.js";

Devvit.configure({
  http: true,
  redditAPI: true,
  redis: true
});

AppSettings.RegisterSettings();
JobController.RegisterJobs();
AppUpgradeTrigger.RegisterTrigger();
MenuRegistrar.RegisterMenus();
registerCustomPostType();

export default Devvit;
