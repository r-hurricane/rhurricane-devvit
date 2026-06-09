/*!
 * Helper methods for converting units.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {DistancePreference, SpeedPreference, UserPreferencesDto} from "../../shared/dtos/redis/UserPreferencesDto.js";

export const speedString = (
    knots: number | string | null | undefined,
    prefs: UserPreferencesDto | SpeedPreference | undefined = 'kts',
    appendUnit: boolean = true,
    digits: number = 0
): string => {
    const parts = convertSpeed(knots, prefs ?? 'kts');
    return `${isNaN(parts[0]) ? ''.padStart(digits, '-') : Math.round(parts[0]).toFixed(0).padStart(digits, ' ')}${appendUnit ? parts[1] : ''}`;
};

export const convertSpeed = (
    knots: number | string | null | undefined,
    prefs: UserPreferencesDto | SpeedPreference | undefined = 'kts'
): [number, string] => {
    const pref = typeof prefs == "string" ? prefs : prefs.speed;
    const speedParsed = knots === undefined || knots === null
        ? NaN
        : (typeof knots == "string" ? parseFloat(knots) : knots);
    switch (pref) {
        case "mph": return [speedParsed * 1.15078, 'mph'];
        case "kph": return [speedParsed * 1.852, 'km/h'];
        case "mps": return [speedParsed * 0.51444, 'm/s'];
        case "kts": default: return [speedParsed, 'kts'];
    }
};

export const distanceString = (
    nauticalMiles: number | string | null | undefined,
    prefs: UserPreferencesDto | DistancePreference | undefined = 'nmi',
    appendUnit: boolean = true,
    digits: number = 0
): string => {
    const parts = convertDistance(nauticalMiles, prefs);
    return `${isNaN(parts[0]) ? ''.padStart(digits, '-') : Math.round(parts[0]).toFixed(0).padStart(digits, ' ')}${appendUnit ? parts[1] : ''}`;
};

export const convertDistance = (
    nauticalMiles: number | string | null | undefined,
    prefs: UserPreferencesDto | DistancePreference | undefined = 'nmi'
): [number, string] => {
    const pref = typeof prefs == "string" ? prefs : prefs.distance;
    const distanceParsed = nauticalMiles === undefined || nauticalMiles === null
        ? NaN
        : (typeof nauticalMiles == "string" ? parseFloat(nauticalMiles) : nauticalMiles);
    switch (pref) {
        case "smi": return [distanceParsed * 1.15078, 'mi'];
        case "km": return [distanceParsed * 1.852, 'km'];
        case "nmi": default: return [distanceParsed, 'nmi'];
    }
};