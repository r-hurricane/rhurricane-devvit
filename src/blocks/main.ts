/*!
 * Registers settings via the old API instead of the devvit.json, because I like using constants
 * for my setting names and values to insure consistency.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, SettingScope} from "@devvit/public-api";
import {SettingKeys, SettingsEnvironment, MaintenanceLevel, LogLevel} from "../shared/SettingConstants";

// Defines the settings for the app using the old API (so I can use constants).
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

export default Devvit;
