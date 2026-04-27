/*!
 * Sends notifications about errors, so they may be fixed immediately so information displayed is not inaccurate!
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {AppSettings} from "./AppSettings";
import {Logger} from "./Logger";
import * as trackerRedis from "../devvit/redis/trackerRedis";

export const sendNotification = async (message: string): Promise<boolean> => {
    // Create logger
    const logger = await Logger.Create('Notifier');

    try {
        // Determine if a notification URL is provided
        const webhookUrl = await AppSettings.GetDiscordNotificationUrl();
        if (!webhookUrl || webhookUrl.length <= 0) return false;

        // Discord has a 1024-character limit. Truncate if too long.
        if (message.length > 1024)
            message = message.substring(0, 1024);

        // Check redis for whether the last notification text matches the message notifying now
        const lastNote = await trackerRedis.getLastNotification();
        if (lastNote && lastNote.text === message) {

            // Now check if still within the silence window (notified X minutes before now)
            const silenceTime = new Date().getTime() - 60000 * (await AppSettings.GetNotificationSilence());
            if (lastNote.time > silenceTime) {
                logger.info("Notification recently sent and silenced.");
                return false;
            }
        }

        // Send webhook API call
        logger.debug('Sending discord notification:', message);
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({content: message})
        });

        // Save notification to Redis (to silence if needed)
        await trackerRedis.saveLastNotification(message);

        return true;

    } catch(e) {
        logger.error('Failed to send notification!', e);
    }

    return false;
};