/*!
 * The start of it all! Configures the required Devvit components, then registers all components.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from '@devvit/public-api';
import {AppSettings} from "./devvit/AppSettings.js";
import {JobController} from "./devvit/jobs/JobController.js";
import {AppUpgradeTrigger} from "./devvit/triggers/AppUpgradeTrigger.js";
import {MenuRegistrar} from "./devvit/menu-items/MenuRegistrar.js";

Devvit.configure({
  http: true,
  redditAPI: true,
  redis: true
});

AppSettings.RegisterSettings();
JobController.Init();
AppUpgradeTrigger.RegisterTrigger();
MenuRegistrar.RegisterMenus();

export default Devvit;
