/*!
 * Renders the User Preferences page.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context, StateSetter, useState} from "@devvit/public-api";
import {
    DistancePreference,
    SpeedPreference,
    UserPreferencesDto
} from "../../../../shared/dtos/redis/UserPreferencesDto.js";
import {LoadingOrError} from "../../LoadingOrError.js";
import {RedisService} from "../../../devvit/redis/RedisService.js";

type PreferenceValue = SpeedPreference | DistancePreference;

interface PreferenceOptionProps {
    label: string;
    value: PreferenceValue;
    currentValue: PreferenceValue;
    setValue: StateSetter<PreferenceValue>;
}

const PreferenceOption = (props: PreferenceOptionProps) => {
    const isActive = props.currentValue === props.value;
    return (
        <hstack
            padding="xsmall"
            border={isActive ? 'thick' : 'thin'}
            cornerRadius="small"
            lightBackgroundColor={isActive ? 'AlienBlue-100' : 'PureGray-50'}
            lightBorderColor={isActive ? 'AlienBlue-700' : 'PureGray-300'}
            darkBackgroundColor={isActive ? 'AlienBlue-800' : 'PureGray-900'}
            darkBorderColor={isActive ? 'AlienBlue-400' : 'PureGray-600'}
            width="25%"
            alignment="middle center"
            onPress={() => props.setValue(props.value)}
        >
            <text
                size="medium"
                weight={isActive ? 'bold' : 'regular'}
                lightColor={isActive ? 'AlienBlue-900' : ''}
                darkColor={isActive ? 'AlienBlue-50' : ''}
            >
                {props.label}
            </text>
        </hstack>
    )
};

interface UserPreferencesPageProps {
    context: Context;
    setShowSettings: StateSetter<boolean>;
    userPreferences: UserPreferencesDto | null;
    setUserPreferences: StateSetter<UserPreferencesDto>;
}

export const UserPreferencesPage = (props: UserPreferencesPageProps) => {
    const [speedState, setSpeedState] = useState<PreferenceValue>(props.userPreferences?.speed ?? 'kts');
    const [distanceState, setDistanceState] = useState<PreferenceValue>(props.userPreferences?.distance ?? 'nmi');
    const [saving, setSaving] = useState<boolean>(false);

    const saveSettings = async () => {
        // Confirm userID is available
        const userId = props.context.userId;
        if (!userId) {
            props.context.ui.showToast({
                text: 'ERROR: There was an error ',
                appearance: 'neutral'
            });
            return;
        }

        setSaving(true);

        const newPreferences = {
            speed: speedState as SpeedPreference,
            distance: distanceState as DistancePreference
        };

        const redis = new RedisService(props.context.redis);
        await redis.saveUserPreferences(userId, newPreferences);

        setSaving(false);
        props.setUserPreferences(newPreferences);
        props.setShowSettings(false);
        props.context.ui.showToast({
            text: 'Success: Preferences saved.',
            appearance: 'success'
        });
    };

    return (
        <zstack width="100%" height="100%">
            <vstack width="100%" height="100%" padding="small" alignment="top start" gap="small" lightBackgroundColor="Global-White" darkBackgroundColor="Global-Black">
                <text style="heading" size="xlarge">Unit Preferences</text>
                <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white" />
                <spacer size="small" />
                <text style="heading">Speed</text>
                <hstack width="100%" gap="small">
                    <PreferenceOption label="kts" value="kts" currentValue={speedState} setValue={setSpeedState} />
                    <PreferenceOption label="mph" value="mph" currentValue={speedState} setValue={setSpeedState} />
                    <PreferenceOption label="km/h" value="kph" currentValue={speedState} setValue={setSpeedState} />
                    <PreferenceOption label="m/s" value="mps" currentValue={speedState} setValue={setSpeedState} />
                </hstack>
                <spacer size="small" />
                <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white" />
                <spacer size="small" />
                <text style="heading">Distance</text>
                <hstack width="100%" gap="small">
                    <PreferenceOption label="nmi" value="nmi" currentValue={distanceState} setValue={setDistanceState} />
                    <PreferenceOption label="mi" value="smi" currentValue={distanceState} setValue={setDistanceState} />
                    <PreferenceOption label="km" value="km" currentValue={distanceState} setValue={setDistanceState} />
                    <hstack width="25%"></hstack>
                </hstack>
                <spacer size="small" />
                <hstack width="100%" height="1px" lightBackgroundColor="black" darkBackgroundColor="white" />
                <spacer size="small" />
                <hstack width="100%" alignment="bottom start">
                    <hstack width="50%" alignment="bottom start">
                        <button disabled={saving} appearance="primary" width="50%" onPress={saveSettings}>Save</button>
                    </hstack>
                    <hstack width="50%" alignment="bottom end">
                        <button disabled={saving} width="50%" onPress={() => {props.setShowSettings(false)}}>Cancel</button>
                    </hstack>
                </hstack>
            </vstack>
            {saving && (
                <vstack width="100%" height="100%" backgroundColor="rgba(0, 0, 0, 0.25)">
                    <LoadingOrError message="Saving..." />
                </vstack>
            )}
        </zstack>
    );
};