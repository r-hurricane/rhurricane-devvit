/*!
* Action to enable the data update process.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {enableDataUpdate} from "../jobs/dataUpdater";

export const startDataUpdaterAction = async () => {
    await enableDataUpdate();
};