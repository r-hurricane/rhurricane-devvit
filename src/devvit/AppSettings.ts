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

enum SettingKeys {

    // Which Environment (Dev or Prod) to use when fetching API data. Default: Production
    RHurricaneEnvironment = 'rhurricane-environment',

    // How frequently (in minutes) to call the summary API to check for updates. Default: 1 minute
    SummaryUpdateFrequency = 'summary-update-freq'
}

export class AppSettings {

    public static async GetEnvironment(settings: SettingsClient): Promise<SettingsEnvironment> {
        return (await settings.get<string>(SettingKeys.RHurricaneEnvironment)) === SettingsEnvironment[SettingsEnvironment.Development]
            ? SettingsEnvironment.Development
            : SettingsEnvironment.Production;
    }

    public static async GetUpdateFrequency(settings: SettingsClient): Promise<number> {
        return await settings.get<number>(SettingKeys.SummaryUpdateFrequency) ?? 1;
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
                        label: 'Development',
                        value: 'Development'
                    },
                    {
                        label: 'Production',
                        value: 'Production'
                    }
                ],
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
            }
        ]);
    }

}