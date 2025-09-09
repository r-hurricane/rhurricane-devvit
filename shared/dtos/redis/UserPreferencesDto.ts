/*!
 * Represents the saved user preferences.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export type SpeedPreference = 'kts' | 'mph' | 'kph' | 'mps';
export type DistancePreference = 'nmi' | 'smi' | 'km';

export type UserPreferencesDto = {
    speed: SpeedPreference;
    distance: DistancePreference;
}

export const DefaultUserPreferences: UserPreferencesDto = {
    speed: "kts",
    distance: "nmi"
};