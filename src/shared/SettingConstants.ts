/*!
 * Definition of settings constants.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

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

export enum SettingKeys {

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
