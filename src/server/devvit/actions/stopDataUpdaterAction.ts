/*!
* Action to disable the data update process.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {disableDataUpdate} from "../jobs/dataUpdater";

export const stopDataUpdaterAction = async () => {
    await disableDataUpdate();
};