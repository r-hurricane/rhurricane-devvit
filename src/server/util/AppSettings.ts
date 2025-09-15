/*!
 * Helper for receiving app settings.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {settings} from "@devvit/web/server";
import {SettingKeys, SettingsEnvironment, MaintenanceLevel, LogLevel} from "../../shared/SettingConstants";

export class AppSettings {

    // Gets the current data environment: Prod = live NHC data, Dev = mock/test data
    public static async GetEnvironment(): Promise<SettingsEnvironment> {
        const val = await settings.get<string[]>(SettingKeys.RHurricaneEnvironment);
        return val && val.length > 0 && val[0] === SettingsEnvironment[SettingsEnvironment.Production]
            ? SettingsEnvironment.Production
            : SettingsEnvironment.Development;
    }

    // Gets the updater job frequency (in minutes)
    public static async GetUpdateFrequency(): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryUpdateFrequency) ?? 1;
    }

    // Gets the configured number of hours before considering the API data to be stale and inaccurate
    public static async GetStaleHours(): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryStaleHours) ?? 12;
    }

    // Gets whether posts should be automatically posted by the system
    public static async GetAutomatePosts(): Promise<boolean> {
        return await settings.get<boolean>(SettingKeys.AutomatePosts) ?? false;
    }

    // Gets the frequency to automatically repost if there are no significant updates.
    public static async GetAutomateRepostFrequency(): Promise<number> {
        return await settings.get<number>(SettingKeys.AutomateRepostFrequency) ?? 0;
    }

    // Gets whether maintenance mode is enabled or not.
    public static async GetMaintenanceMode(): Promise<MaintenanceLevel> {
        const savedLvl = await settings.get<string[]>(SettingKeys.MaintenanceMode);
        const key = savedLvl && savedLvl.length > 0 && savedLvl[0] ? savedLvl[0] : null;
        return (key ? MaintenanceLevel[key as keyof typeof MaintenanceLevel] : MaintenanceLevel.Off) ?? MaintenanceLevel.Off;
    }

    // Gets the custom maintenance message.
    public static async GetMaintenanceModeMessage(): Promise<string | null> {
        const val = await settings.get<string>(SettingKeys.MaintenanceModeMessage);
        return val && val.length > 0 ? val : null;
    }

    // Gets the configured log level to reduce the amount of logs
    public static async GetLogLevel(): Promise<LogLevel> {
        const savedLvl = await settings.get<string[]>(SettingKeys.LogLevel);
        const key = savedLvl && savedLvl.length > 0 && savedLvl[0] ? savedLvl[0] : null;
        return (key ? LogLevel[key as keyof typeof LogLevel] : LogLevel.Error) ?? LogLevel.Error;
    }

    // Gets the discord notification webhook url, if provided
    public static async GetDiscordNotificationUrl(): Promise<string | undefined> {
        return await settings.get<string>(SettingKeys.DiscordNotificationUrl);
    }

    // Gets frequency (in minutes) the same notification should be silenced
    public static async GetNotificationSilence(): Promise<number> {
        return await settings.get<number>(SettingKeys.NotificationSilence) ?? 30;
    }

}
