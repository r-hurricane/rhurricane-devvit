/*!
 * Sends notifications about errors, so they may be fixed immediately so information displayed is not inaccurate!
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {JobContext, RedisClient, SettingsClient} from "@devvit/public-api";
import {AppSettings} from "../AppSettings.js";
import {Logger} from "../Logger.js";
import {RedisService} from "../redis/RedisService.js";

export class Notifier {

    readonly #settings: SettingsClient;
    readonly #redis: RedisClient;

    #init: boolean = false;
    #webhookUrl: string | undefined;

    public enabled: boolean = false;

    public static async Create(context: JobContext) {
        const notifier = new Notifier(context);
        notifier.#webhookUrl = await AppSettings.GetDiscordNotificationUrl(context.settings);
        notifier.#init = true;
        notifier.enabled = !!notifier.#webhookUrl && notifier.#webhookUrl.length > 0;
        return notifier;
    }

    private constructor(context: JobContext) {
        this.#settings = context.settings;
        this.#redis = context.redis;
    }

    public async send(message: string): Promise<boolean> {
        if (!this.#init) throw new Error('You must create a Notifier by calling the Create() static method!');
        if (!this.#webhookUrl || this.#webhookUrl.length <= 0) return false;

        // Create logger
        const logger = await Logger.Create('Notifier', this.#settings);

        try {
            // Discord has a 1024-character limit. Truncate if too long.
            if (message.length > 1024)
                message = message.substring(0, 1024);

            // Check redis for whether the last notification text matches the message notifying now
            const redis = new RedisService(this.#redis);
            const lastNote = await redis.getLastNotification();
            if (lastNote && lastNote.text === message) {

                // Now check if still within the silence window (notified X minutes before now)
                const silenceTime = new Date().getTime() - 60000 * (await AppSettings.GetNotificationSilence(this.#settings));
                if (lastNote.time > silenceTime) {
                    logger.info("Notification recently sent and silenced.");
                    return false;
                }
            }

            // Send webhook API call
            logger.debug('Sending discord notification:', message);
            await fetch(this.#webhookUrl, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: message})
            });

            // Save notification to Redis (to silence if needed)
            await redis.saveLastNotification(message);

            return true;

        } catch(e) {
            logger.error('Failed to send notification!', e);
        }

        return false;
    }
}