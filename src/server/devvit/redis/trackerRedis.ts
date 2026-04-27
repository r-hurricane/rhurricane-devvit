/*!
 * Service for getting and setting saved Redis data.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { redis } from '@devvit/web/server';
import {SummaryApiSchema} from "./schemas/summary-api/SummaryApiSchema.js";
import {LastNotificationType, LastNotificationSchema} from "./schemas/LastNotificationSchema.js";
import {UserPreferencesSchema} from "./schemas/UserPreferencesSchema.js";
import {SummaryApiDto} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos";
import {UserPreferencesDto} from "../../../shared/dtos/redis/UserPreferencesDto";

const RedisKeys = {
    dataUpdater: () => `summary:job:id`,
    summaryApiLastModified: () => `rhurricane:summaryapi:last_modified`,
    summaryApiData: () => `rhurricane:summaryapi:data`,
    summaryApiLastRepost: () => `rhurricane:summaryapi:last_repost`,
    lastNotification: () => `rhurricane:notify:last`,
    userPreference: (userId: string) => `rhurricane:userpref:${userId}`
};

/* ============================ */
/* ===== Data-Updater Job ===== */
/* ============================ */
export const isDataUpdaterJobEnabled = async (): Promise<boolean> => {
    return !!(await redis.get(RedisKeys.dataUpdater()));
};

export const enableDataUpdaterJob = async (id: string): Promise<void> => {
    await redis.set(RedisKeys.dataUpdater(), id);
};

export const disableDataUpdaterJob = async (): Promise<void> => {
    await redis.del(RedisKeys.dataUpdater());
};

/* ================================= */
/* ===== Summary Last Modified ===== */
/* ================================= */
export const getSummaryApiLastModified = async (): Promise<string | undefined> => {
    return await redis.get(RedisKeys.summaryApiLastModified());
};

export const saveSummaryApiLastModified = async (lastModified: string): Promise<void> => {
    await redis.set(RedisKeys.summaryApiLastModified(), lastModified);
};

/* ============================ */
/* ===== Summary API Data ===== */
/* ============================ */
export const getSummaryApiData = async (): Promise<SummaryApiDto | null> => {
    const savedJson = await redis.get(RedisKeys.summaryApiData());
    if (!savedJson) return null;

    const parsedJson = await SummaryApiSchema.parseAsync(JSON.parse(savedJson));
    return parsedJson satisfies SummaryApiDto;
};

export const saveSummaryApiData = async (summaryApiData: object, checkSchema: boolean = true): Promise<string> => {
    // TODO: Is there a type checking way to parse if a summary was not already given?
    if (checkSchema)
        await SummaryApiSchema.parseAsync(summaryApiData);
    return await redis.set(RedisKeys.summaryApiData(), JSON.stringify(summaryApiData));
};

/* ================================= */
/* ===== Last Repost Date/Time ===== */
/* ================================= */
export const getSummaryApiLastReposted = async (): Promise<number | undefined> => {
    const strVal = await redis.get(RedisKeys.summaryApiLastRepost());
    const intVal = strVal ? parseInt(strVal) : undefined;
    return intVal !== undefined && !isNaN(intVal) ? intVal : undefined;
};

export const saveSummaryApiLastReposted = async (lastReposted: number): Promise<void> => {
    await redis.set(RedisKeys.summaryApiLastRepost(), JSON.stringify(lastReposted));
};

/* =================================== */
/* ===== Notification Rate Limit ===== */
/* =================================== */
export const getLastNotification = async (): Promise<LastNotificationType | null> => {
    const savedJson = await redis.get(RedisKeys.lastNotification());
    if (!savedJson) return null;

    const parsedJson = await LastNotificationSchema.parseAsync(JSON.parse(savedJson));
    return parsedJson satisfies LastNotificationType;
};

export const saveLastNotification = async (text: string): Promise<string> => {
    return await redis.set(RedisKeys.lastNotification(), JSON.stringify({
        text: text,
        time: new Date().getTime()
    } satisfies LastNotificationType));
};

/* ============================ */
/* ===== User Preferences ===== */
/* ============================ */
export const getUserPreferences = async (userId: string): Promise<UserPreferencesDto | null> => {
    const savedJson = await redis.get(RedisKeys.userPreference(userId));
    if (!savedJson) return null;

    const parsedJson = await UserPreferencesSchema.parseAsync(JSON.parse(savedJson));
    return parsedJson satisfies UserPreferencesDto;
};

export const saveUserPreferences = async (userId: string, preferences: UserPreferencesDto): Promise<string> => {
    return await redis.set(RedisKeys.userPreference(userId), JSON.stringify(preferences));
};