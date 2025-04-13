/*!
 * Sends notifications about errors, so they may be fixed immediately so information displayed is not inaccurate!
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SettingsClient} from "@devvit/public-api";
import {AppSettings} from "../AppSettings.js";

export class Notifier {

    #init: boolean = false;
    #webhookUrl: string | undefined;

    public enabled: boolean = false;

    public static async Create(settings: SettingsClient) {
        const notifier = new Notifier();
        notifier.#webhookUrl = await AppSettings.GetDiscordNotificationUrl(settings);
        notifier.#init = true;
        notifier.enabled = !!notifier.#webhookUrl && notifier.#webhookUrl.length > 0;
        return notifier;
    }

    private constructor() { }

    public async send(message: string): Promise<boolean> {
        if (!this.#init) throw new Error('[Notifier] You must create a Notifier by calling the Create() static method!');
        if (!this.#webhookUrl || this.#webhookUrl.length <= 0) return false;

        try {
            console.log('[Notifier] Sending discord notification:', message);

            await fetch(this.#webhookUrl, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: message})
            });

            return true;

        } catch(e) {
            console.error('[Notifier] Failed to send notification! ', e);
        }

        return false;
    }
}