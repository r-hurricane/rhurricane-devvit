/*!
* Define API routes for dashboard view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Hono} from "hono";
import {ApiErrorResponse} from "../../../shared/api";
import {Logger} from "../../util/Logger";

export const dashboard = new Hono();

dashboard.get('/init', async (c) => {
    const logger = await Logger.Create('Dashboard - Init');
    try {

        return c.json<ApiErrorResponse>({ error: 'Not yet implemented' }, 200);
    } catch (error) {
        logger.error('Error with init API: ', error);
        return c.json<ApiErrorResponse>({error: 'Error getting outlook data'}, 500);
    }
});