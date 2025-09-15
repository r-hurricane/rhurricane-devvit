/*!
 * Service for getting and setting saved Redis data.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {redis} from "@devvit/web/server";
import {SummaryApiDto} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos.js";
import {UserPreferencesDto} from "../../../shared/dtos/redis/UserPreferencesDto.js";
import {SummaryApiSchema} from "./schemas/summary-api/SummaryApiSchema.js";
import {LastNotificationDto, LastNotificationSchema} from "./schemas/LastNotificationSchema.js";
import {UserPreferencesSchema} from "./schemas/UserPreferencesSchema.js";

export class RedisService {

    #redisKeys = {
        runDataUpdater: () => `rhurricane:runUpdater`,
        summaryApiLastModified: () => `rhurricane:summaryapi:last_modified`,
        summaryApiData: () => `rhurricane:summaryapi:data`,
        summaryApiLastRepost: () => `rhurricane:summaryapi:last_repost`,
        lastNotification: () => `rhurricane:notify:last`,
        userPreference: (userId: string) => `rhurricane:userpref:${userId}`
    };

    /* ========================================= */
    /* ===== Enable / Disable Data Updater ===== */
    /* ========================================= */
    public async getRunDataUpdater(): Promise<boolean> {
        return (await redis.get(this.#redisKeys.runDataUpdater()))?.toLowerCase() === 'true';
    }

    public async setRunDataUpdater(enable: boolean): Promise<void> {
        await redis.set(this.#redisKeys.summaryApiLastModified(), enable ? 'true' : 'false');
    }

    /* ================================= */
    /* ===== Summary Last Modified ===== */
    /* ================================= */
    public async getSummaryApiLastModified(): Promise<string | undefined> {
        return await redis.get(this.#redisKeys.summaryApiLastModified());
    }

    public async saveSummaryApiLastModified(lastModified: string): Promise<void> {
        await redis.set(this.#redisKeys.summaryApiLastModified(), lastModified);
    }

    /* ============================ */
    /* ===== Summary API Data ===== */
    /* ============================ */
    public async getSummaryApiData(): Promise<SummaryApiDto | null> {
        const savedJson = await redis.get(this.#redisKeys.summaryApiData());
        if (!savedJson) return null;

        const parsedJson = await SummaryApiSchema.parseAsync(JSON.parse(savedJson));
        return parsedJson satisfies SummaryApiDto;
    }

    public async saveSummaryApiData(summaryApiData: unknown, checkSchema: boolean = true): Promise<string> {
        // TODO: Is there a type checking way to parse if a summary was not already given?
        if (checkSchema)
            await SummaryApiSchema.parseAsync(summaryApiData);
        return await redis.set(this.#redisKeys.summaryApiData(), JSON.stringify(summaryApiData));
    }

    /* ================================= */
    /* ===== Last Repost Date/Time ===== */
    /* ================================= */
    public async getSummaryApiLastReposted(): Promise<number | undefined> {
        const strVal = await redis.get(this.#redisKeys.summaryApiLastRepost());
        const intVal = strVal ? parseInt(strVal) : undefined;
        return intVal !== undefined && !isNaN(intVal) ? intVal : undefined;
    }

    public async saveSummaryApiLastReposted(lastReposted: number): Promise<void> {
        await redis.set(this.#redisKeys.summaryApiLastRepost(), JSON.stringify(lastReposted));
    }

    /* =================================== */
    /* ===== Notification Rate Limit ===== */
    /* =================================== */
    public async getLastNotification(): Promise<LastNotificationDto | null> {
        const savedJson = await redis.get(this.#redisKeys.lastNotification());
        if (!savedJson) return null;

        const parsedJson = await LastNotificationSchema.parseAsync(JSON.parse(savedJson));
        return parsedJson satisfies LastNotificationDto;
    }

    public async saveLastNotification(text: string): Promise<string> {
        return await redis.set(this.#redisKeys.lastNotification(), JSON.stringify({
            text: text,
            time: new Date().getTime()
        } satisfies LastNotificationDto));
    }

    /* ============================ */
    /* ===== User Preferences ===== */
    /* ============================ */
    public async getUserPreferences(userId: string): Promise<UserPreferencesDto | null> {
        const savedJson = await redis.get(this.#redisKeys.userPreference(userId));
        if (!savedJson) return null;

        const parsedJson = await UserPreferencesSchema.parseAsync(JSON.parse(savedJson));
        return parsedJson satisfies UserPreferencesDto;
    }

    public async saveUserPreferences(userId: string, preferences: UserPreferencesDto): Promise<string> {
        return await redis.set(this.#redisKeys.userPreference(userId), JSON.stringify(preferences));
    }

}
