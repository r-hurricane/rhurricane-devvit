/*!
 * Registers with Devvit the various settings to control the app's configuration.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, SettingsClient, SettingScope} from '@devvit/public-api';

// Represents the data environment. Prod uses live NHC data. Dev uses mock or old data for testing.
export enum SettingsEnvironment {
    Development,
    Production
}

// Represents the log level of the application.
export enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace
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
    public static async GetEnvironment(settings: SettingsClient): Promise<SettingsEnvironment> {
        const val = await settings.get<string[]>(SettingKeys.RHurricaneEnvironment);
        return val && val.length > 0 && val[0] === SettingsEnvironment[SettingsEnvironment.Production]
            ? SettingsEnvironment.Production
            : SettingsEnvironment.Development;
    }

    // Gets the updater job frequency (in minutes)
    public static async GetUpdateFrequency(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryUpdateFrequency) ?? 1;
    }

    // Gets the configured number of hours before considering the API data to be stale and inaccurate
    public static async GetStaleHours(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryStaleHours) ?? 12;
    }

    // Gets whether posts should be automatically posted by the system
    public static async GetAutomatePosts(settings: SettingsClient): Promise<boolean> {
        return await settings.get<boolean>(SettingKeys.AutomatePosts) ?? false;
    }

    // Gets the frequency to automatically repost if there are no significant updates.
    public static async GetAutomateRepostFrequency(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.AutomateRepostFrequency) ?? 0;
    }

    // Gets whether maintenance mode is enabled or not.
    public static async GetMaintenanceMode(settings: SettingsClient): Promise<MaintenanceLevel> {
        const savedLvl = await settings.get<string[]>(SettingKeys.MaintenanceMode);
        const key = savedLvl && savedLvl.length > 0 && savedLvl[0] ? savedLvl[0] : null;
        return (key ? MaintenanceLevel[key as keyof typeof MaintenanceLevel] : MaintenanceLevel.Off) ?? MaintenanceLevel.Off;
    }

    // Gets the custom maintenance message.
    public static async GetMaintenanceModeMessage(settings: SettingsClient): Promise<string | null> {
        const val = await settings.get<string>(SettingKeys.MaintenanceModeMessage);
        return val && val.length > 0 ? val : null;
    }

    // Gets the configured log level to reduce the amount of logs
    public static async GetLogLevel(settings: SettingsClient): Promise<LogLevel> {
        const savedLvl = await settings.get<string[]>(SettingKeys.LogLevel);
        const key = savedLvl && savedLvl.length > 0 && savedLvl[0] ? savedLvl[0] : null;
        return (key ? LogLevel[key as keyof typeof LogLevel] : LogLevel.Error) ?? LogLevel.Error;
    }

    // Gets the discord notification webhook url, if provided
    public static async GetDiscordNotificationUrl(settings: SettingsClient): Promise<string | undefined> {
        return await settings.get<string>(SettingKeys.DiscordNotificationUrl);
    }

    // Gets frequency (in minutes) the same notification should be silenced
    public static async GetNotificationSilence(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.NotificationSilence) ?? 30;
    }

    public static RegisterSettings(): void {
        Devvit.addSettings([
            {
                type: 'select',
                name: SettingKeys.RHurricaneEnvironment,
                label: 'Data Environment',
                helpText: 'Production uses live data from the National Hurricane Center. Development uses test data.',
                options: [
                    {
                        label: SettingsEnvironment[SettingsEnvironment.Production],
                        value: SettingsEnvironment[SettingsEnvironment.Production]
                    },
                    {
                        label: SettingsEnvironment[SettingsEnvironment.Development],
                        value: SettingsEnvironment[SettingsEnvironment.Development]
                    }
                ],
                defaultValue: [SettingsEnvironment[SettingsEnvironment.Production]],
                multiSelect: false,
                scope: SettingScope.Installation
            },
            {
                type: 'number',
                name: SettingKeys.SummaryUpdateFrequency,
                label: 'Data Check Frequency (min)',
                helpText: 'How frequently to check for updates on the summary API.',
                defaultValue: 1,
                scope: SettingScope.Installation,
                onValidate: event => {
                    if (event.value! < 1)
                        return 'Frequency must be at least 1';
                    if (event.value! > 60)
                        return 'Frequency must be 60 or less';
                }
            },
            {
                type: 'number',
                name: SettingKeys.SummaryStaleHours,
                label: 'Data API Stale Time (hr)',
                helpText: 'When to consider the summary API data to be outdated and not displayed.',
                defaultValue: 12,
                scope: SettingScope.Installation,
                onValidate: event => {
                    if (event.value! < 1)
                        return 'Value must be at least 1';
                }
            },
            {
                type: 'boolean',
                name: SettingKeys.AutomatePosts,
                label: 'Enable Post Automation',
                helpText: 'Whether to allow the app to automatically create a post. Either when there are significant changes, or (if enabled below) periodically when there are no new changes.',
                defaultValue: false,
                scope: SettingScope.Installation
            },
            {
                type: 'number',
                name: SettingKeys.AutomateRepostFrequency,
                label: 'Repost Freq (hr)',
                helpText: 'How frequently to repost if no significant changes. Must be Six (6) or greater. Zero (0) disables this feature.',
                defaultValue: 0,
                scope: SettingScope.Installation,
                onValidate: event => {
                    if (event.value! < 0)
                        return 'Value must be a positive number.';
                    if (event.value! > 0 && event.value! < 6)
                        return 'Value must be 0 or at least 6.';
                }
            },
            {
                type: 'select',
                name: SettingKeys.MaintenanceMode,
                label: 'Maintenance Mode',
                helpText: 'Whether to enable or disable maintenance mode. Soft displays an announcement and the app is usable. Hard only displays the message and (X) icon.',
                options: [
                    {
                        label: MaintenanceLevel[MaintenanceLevel.Off],
                        value: MaintenanceLevel[MaintenanceLevel.Off]
                    },
                    {
                        label: MaintenanceLevel[MaintenanceLevel.Soft],
                        value: MaintenanceLevel[MaintenanceLevel.Soft]
                    },
                    {
                        label: MaintenanceLevel[MaintenanceLevel.Hard],
                        value: MaintenanceLevel[MaintenanceLevel.Hard]
                    }
                ],
                defaultValue: [MaintenanceLevel[MaintenanceLevel.Off]],
                multiSelect: false,
                scope: SettingScope.Installation
            },
            {
                type: 'string',
                name: SettingKeys.MaintenanceModeMessage,
                label: 'Custom Maintenance Message',
                helpText: 'A message to display when maintenance is enabled.',
                defaultValue: '',
                scope: SettingScope.Installation
            },
            {
                type: 'select',
                name: SettingKeys.LogLevel,
                label: 'Log Level',
                helpText: 'Controls the level of log messages for performance.',
                options: [
                    {
                        label: LogLevel[LogLevel.Error],
                        value: LogLevel[LogLevel.Error]
                    },
                    {
                        label: LogLevel[LogLevel.Warn],
                        value: LogLevel[LogLevel.Warn]
                    },
                    {
                        label: LogLevel[LogLevel.Info],
                        value: LogLevel[LogLevel.Info]
                    },
                    {
                        label: LogLevel[LogLevel.Debug],
                        value: LogLevel[LogLevel.Debug]
                    },
                    {
                        label: LogLevel[LogLevel.Trace],
                        value: LogLevel[LogLevel.Trace]
                    }
                ],
                defaultValue: [LogLevel[LogLevel.Warn]],
                multiSelect: false,
                scope: SettingScope.Installation
            },
            {
                type: 'string',
                name: SettingKeys.DiscordNotificationUrl,
                label: 'Discord Notification URL',
                helpText: 'A Discord channel webhook URL to send alerts to.',
                scope: SettingScope.Installation,
                onValidate: event => {
                    if (event.value && event.value.length > 0 &&
                        !event.value.startsWith('https://discord.com/api/webhooks')
                    ) {
                        return `Value must be a valid discord webhook URL.`
                    }
                }
            },
            {
                type: 'number',
                name: SettingKeys.NotificationSilence,
                label: 'Notification Silence (min)',
                helpText: 'How long to silence the same notification sent to Discord.',
                defaultValue: 30,
                scope: SettingScope.Installation,
                onValidate: event => {
                    if (event.value! < 0)
                        return 'Value must be at least 0';
                }
            }
        ]);
    }

}