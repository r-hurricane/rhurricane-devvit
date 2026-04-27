/*!
* Define form handler to perfrom actions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { actionMenuActions } from "../actions";
import {Logger} from "../../util/Logger";
import {isMod} from "../../util/userUtils";
import {context} from "@devvit/web/server";

type ApplicationFormValues = {
    action?: string;
};

export const forms = new Hono();

forms.post('/tracker-actions', async (c) => {
    const logger = new Logger('Form - Tracker Actions');
    let action = '<unknown>';

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

        // Get the action form value
        const values = await c.req.json<ApplicationFormValues>();
        action = typeof values.action === 'string' ? values.action.trim() : '';
        logger.warn(`User ${context.userId} - ${context.username} has requested action ${action}.`);

        // Confirm action exists
        const actionMethod = !!action && Object.hasOwn(actionMenuActions, action)
            ? actionMenuActions[action]
            : undefined;

        // Execute action (assume no exception is successful)
        if (actionMethod) {
            const result = await actionMethod();
            return c.json<UiResponse>(result ?? {
                showToast: {text: 'Action successfully performed.', appearance: 'success'}
            }, 200);
        }

        // Otherwise, log error
        logger.error(`Unknown action ${action} received.`);
        return c.json<UiResponse>(
            {
                showToast: {
                    text: `Unknown action ${action}.`,
                    appearance: 'neutral'
                }
            },
            400
        );

    } catch (error) {
        logger.error(`Error processing action: `, action, error);
        return c.json<UiResponse>(
            {
                showToast: { text: 'ERROR: Failed to show action form', appearance: 'neutral' }
            },
            500
        );
    }
});
