/*!
 * Registers a route for handling the user's selection from the Action Menu form.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from "../../PathFactory";
import { Router } from "express";
import { Logger } from "../../util/Logger";
import { isMod } from "../../util/userUtils";
import { actionMenuActions } from "./actions";

export const ACTION_MENU_FORM_PATH = '/internal/form/action-menu';

export const registerActionMenuForm: PathFactory = (router: Router) => {
    router.post(ACTION_MENU_FORM_PATH, async (req, res): Promise<void> => {
        const logger = await Logger.Create("Form - Action Menu");
        logger.traceStart(ACTION_MENU_FORM_PATH);

        try {
            // Check user is a mod
            if (!(await isMod())) {
                res.status(401).json({
                    showToast: {
                        text: 'This action requires moderator access.',
                        appearance: 'neutral'
                    }
                });
                logger.info("User is not a moderator.");
                return;
            }

            const val = req.body?.action;
            if (val && Object.prototype.hasOwnProperty.call(actionMenuActions, val)) {
                // @ts-expect-error checked above with hasOwnProperty
                await actionMenuActions[val](res);
                return;
            }

            logger.error('Unknown action:', val);
            res.status(400).json({
                showToast: {
                    text: `ERROR: unknown action: ${val}.`,
                    appearance: 'neutral'
                }
            });
        } catch (e) {
            logger.error('Error performing action:', e);
            res.status(500).json({
                showToast: {
                    text: `ERROR: There was an error performing action: ${req.body?.action}.`,
                    appearance: 'neutral'
                }
            });
        }

        logger.traceEnd();
    });
};
