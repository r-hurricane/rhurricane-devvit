/*!
 * Adds a subreddit level button which displays a form for various actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {Logger} from "../Logger.js";
import {isMod} from "../utils/userUtils.js";
import {actionMenuActions} from "./actions/index.js";

export class CommandMenuItem {

    public static Register() {
        Devvit.addMenuItem({
            forUserType: ['moderator'],
            label: 'RHurricane - Actions',
            location: 'subreddit',
            onPress: async (_, context) => {

                // Create logger
                const logger = await Logger.Create('Menu - Actions', context.settings);

                try {
                    // Check user is a mod
                    if (!(await isMod(context))) {
                        context.ui.showToast({
                           text: 'This action requires moderator access.',
                           appearance: 'neutral'
                        });
                        logger.info("User is not a moderator.");
                        return;
                    }

                    // Generate options from action list
                    const options = Object.keys(actionMenuActions)
                        .map(k => ({
                            label: k.replaceAll('-', ' '),
                            value: k
                        }));

                    // Show form
                    const commandForm = Devvit.createForm(
                        {
                            fields: [
                                {
                                    name: 'action',
                                    label: 'Action',
                                    type: 'select',
                                    options: options
                                },
                            ],
                            title: 'Select Action',
                            acceptLabel: 'Perform Action'
                        },
                        async ({ values }, ctx) => {
                            try {

                                // Check user is a mod
                                if (!(await isMod(context))) {
                                    context.ui.showToast({
                                        text: 'This action requires moderator access.',
                                        appearance: 'neutral'
                                    });
                                    logger.info("User is not a moderator.");
                                    return;
                                }

                                if (actionMenuActions.hasOwnProperty(values.action)) {
                                    await actionMenuActions[values.action](ctx);
                                    return;
                                }

                                logger.error('Unknown action:', values.action);
                                ctx.ui.showToast({
                                    text: `ERROR: unknown action: ${values.action}.`,
                                    appearance: 'neutral'
                                });
                            } catch (e) {
                                logger.error('Error performing action:', e);
                                ctx.ui.showToast({
                                    text: `ERROR: There was an error performing action: ${values.action}.`,
                                    appearance: 'neutral'
                                });
                            }
                        }
                    );

                    context.ui.showForm(commandForm);

                } catch (ex) {
                    logger.error('Error performing action:', ex);
                    context.ui.showToast({
                        text: 'ERROR: There was an error performing action.',
                        appearance: 'neutral'
                    });
                }
            }
        });
    }

}