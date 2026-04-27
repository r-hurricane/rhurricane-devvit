/*!
* Register menu item for triggering action form.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server'
import {Logger} from "../../util/Logger";
import {isMod} from "../../util/userUtils";
import {actionMenuActions} from "../actions";

export const menus = new Hono();

menus.post('/tracker-actions', async (c) => {
    const logger = new Logger('Menu - Tracker Actions');

    try {
        // Confirm user is mod
        if (!(await isMod())) {
            logger.warn(`User ${context.userId} - ${context.username} is not a mod and tried requesting mod actions.`);
            return c.json<UiResponse>(
                {
                    showToast: {
                        text: 'Tracker Actions require mod permissions.',
                        appearance: 'neutral'
                    }
                },
                403
            );
        }

        // Show form
        logger.info(`User ${context.userId} - ${context.username} tried requesting mod actions.`);
        return c.json<UiResponse>(
            {
                showForm: {
                    name: 'tracker-actions',
                    form: {
                        title: 'Select Action',
                        acceptLabel: 'Perform Action',
                        fields: [
                            {
                                name: 'action',
                                label: 'Action',
                                type: 'select',
                                options: Object.keys(actionMenuActions)
                                    .map(k => ({
                                        label: k.replace(/-/g, ' '),
                                        value: k
                                    }))
                            },
                        ]
                    }
                }
            },
            200
        );

    } catch (error) {
        logger.error(`Error showing action form: `, error);
        return c.json<UiResponse>(
            {
                showToast: { text: 'ERROR: Failed to show action form', appearance: 'neutral' }
            },
            500
        );
    }
});
