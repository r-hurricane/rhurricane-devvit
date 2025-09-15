/*!
 * Registers a route for displaying the Action Form when the subreddit level action menu is engaged.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from "../../PathFactory";
import { Router } from "express";
import { Logger } from "../../util/Logger";
import { isMod } from "../../util/userUtils";
import { actionMenuActions } from "./actions";

const formFields = {
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
    ],
    title: 'Select Action',
    acceptLabel: 'Perform Action'
};

export const ACTION_MENU_PATH = '/internal/menu/action-menu';

export const registerActionMenu: PathFactory = (router: Router) => {
    router.post(ACTION_MENU_PATH, async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Menu - Action");
        logger.traceStart(ACTION_MENU_PATH);

        try {
            // Check user is a mod
            if (!(await isMod())) {
                res.status(401).json({
                    showToast: {
                        text: 'This action requires moderator access.',
                        appearance: 'neutral'
                    }
                })
                logger.info("User is not a moderator.");
                return;
            }

            res.status(200).json({
                showForm: {
                    name: 'actionMenu',
                    form: { fields: formFields }
                }
            });

        } catch (error) {
            logger.error('Error performing action: ', error);
            res.status(500).json({
                showToast: {
                    text: 'Error performing action.',
                    appearance: 'neutral'
                }
            });
        }

        logger.traceEnd();
    });
};
