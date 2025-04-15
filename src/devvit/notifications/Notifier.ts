/*!
 * Sends notifications about errors, so they may be fixed immediately so information displayed is not inaccurate!
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SettingsClient} from "@devvit/public-api";
import {AppSettings} from "../AppSettings.js";
import {Logger} from "../Logger.js";

export class Notifier {

    #init: boolean = false;
    #webhookUrl: string | undefined;
    #settings: SettingsClient;

    public enabled: boolean = false;

    public static async Create(settings: SettingsClient) {
        const notifier = new Notifier(settings);
        notifier.#webhookUrl = await AppSettings.GetDiscordNotificationUrl(settings);
        notifier.#init = true;
        notifier.enabled = !!notifier.#webhookUrl && notifier.#webhookUrl.length > 0;
        return notifier;
    }

    private constructor(settings: SettingsClient) {
        this.#settings = settings;
    }

    public async send(message: string): Promise<boolean> {
        if (!this.#init) throw new Error('You must create a Notifier by calling the Create() static method!');
        if (!this.#webhookUrl || this.#webhookUrl.length <= 0) return false;

        // Create logger
        const logger = await Logger.Create('Notifier', this.#settings);

        try {
            logger.info('Sending discord notification:', message);

            if (message.length > 1024)
                message = message.substring(0, 1024);

            await fetch(this.#webhookUrl, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: message})
            });

            return true;

        } catch(e) {
            logger.error('Failed to send notification! ', e);
        }

        return false;
    }
}