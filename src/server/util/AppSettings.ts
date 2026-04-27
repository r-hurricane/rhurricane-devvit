/*!
 * Helper for receiving app settings.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {settings} from '@devvit/web/server';

// Represents the log level of the application.
export enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace
}

// Represents the data environment. Prod uses live NHC data. Dev uses mock or old data for testing.
export enum SettingsEnvironment {
    Development,
    Production
}

// Represents the three maintenance levels
export enum MaintenanceLevel {
    Off,
    Soft,
    Hard
}

// An enum of all settings keys (internal AppSettings use only)
enum SettingKeys {
    
    // Which Environment (Dev or Prod) to use when fetching API data. Default: Production
    RHurricaneEnvironment = 'rhurricane-environment',

    // How frequently (in minutes) to call the summary API to check for updates. Default: 1 minute
    SummaryUpdateFrequency = 'summary-update-freq',

    // How many hours before considering summary data to be stale
    SummaryStaleHours = 'summary-stale-hours',

    // Whether to repost when there are new significant TWO or Storm Advisories issued
    AutomatePosts = 'automate-posts',

    // How frequently to repost (when no changed activity)
    AutomateRepostFrequency = 'automate-repost-freq',

    // Whether in maintenance mode or not
    MaintenanceMode = 'maintenance-mode',

    // Customized maintenance mode message
    MaintenanceModeMessage = 'maintenance-mode-message',

    // Logging level
    LogLevel = 'log-level',

    // Webhook URL to send notifications to
    DiscordNotificationUrl = 'discord-noti-url',

    // How frequently (in minutes) the same notification should be silenced
    NotificationSilence = 'noti-silence'
}

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
