/*!
 * Registers with Devvit the various settings to control the app's configuration.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, SettingsClient, SettingScope} from '@devvit/public-api';

export enum SettingsEnvironment {
    Development,
    Production
}

export enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace
}

enum SettingKeys {

    // Which Environment (Dev or Prod) to use when fetching API data. Default: Production
    RHurricaneEnvironment = 'rhurricane-environment',

    // How frequently (in minutes) to call the summary API to check for updates. Default: 1 minute
    SummaryUpdateFrequency = 'summary-update-freq',

    // How many hours before considering summary data to be stale
    SummaryStaleHours = 'summary-stale-hours',

    // Logging level
    LogLevel = 'log-level',

    // Webhook URL to send notifications to
    DiscordNotificationUrl = 'discord-noti-url'
}

export class AppSettings {

    public static async GetEnvironment(settings: SettingsClient): Promise<SettingsEnvironment> {
        const val = await settings.get<string[]>(SettingKeys.RHurricaneEnvironment);
        return val && val.length > 0 && val[0] === SettingsEnvironment[SettingsEnvironment.Development]
            ? SettingsEnvironment.Development
            : SettingsEnvironment.Production;
    }

    public static async GetUpdateFrequency(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryUpdateFrequency) ?? 1;
    }

    public static async GetStaleHours(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryStaleHours) ?? 12;
    }

    public static async GetLogLevel(settings: SettingsClient): Promise<LogLevel> {
        const savedLvl = await settings.get<string[]>(SettingKeys.LogLevel);
        const key = savedLvl && savedLvl.length > 0 && savedLvl[0] ? savedLvl[0] : null;
        return (key ? LogLevel[key as keyof typeof LogLevel] : LogLevel.Error) ?? LogLevel.Error;
    }

    public static async GetDiscordNotificationUrl(settings: SettingsClient): Promise<string | undefined> {
        return await settings.get<string>(SettingKeys.DiscordNotificationUrl);
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
                type: 'select',
                name: SettingKeys.LogLevel,
                label: 'Log Level',
                helpText: 'Configured the level of logging for performance.',
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
            }
        ]);
    }

}