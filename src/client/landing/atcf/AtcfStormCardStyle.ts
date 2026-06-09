/*!
* Helper utility for getting the style of an ATCF Storm.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export type AtcfStormCardStyle = {
    border: string;
    background: string;
};

export const getAtcfCardStyle = (susWind: number | null): AtcfStormCardStyle => {
    if (susWind == null)
        return {
            border: 'border-puregray-200 dark:border-puregray-700',
            background: 'bg-puregray-50 dark:bg-puregray-900'
        };
    if (susWind >= 137)
        return {
            border: 'border-fuchsia-200 dark:border-fuchsia-800',
            background: 'bg-fuchsia-50 dark:bg-fuchsia-950'
        };
    if (susWind >= 113)
        return {
            border: 'border-pink-200 dark:border-pink-800',
            background: 'bg-pink-50 dark:bg-pink-950'
        };
    if (susWind >= 96)
        return {
            border: 'border-red-200 dark:border-red-700',
            background: 'bg-red-50 dark:bg-red-900'
        };
    if (susWind >= 83)
        return {
            border: 'border-orange-200 dark:border-orange-800',
            background: 'bg-orange-50 dark:bg-orange-950'
        };
    if (susWind >= 64)
        return {
            border: 'border-yellow-200 dark:border-yellow-700',
            background: 'bg-yellow-50 dark:bg-yellow-900'
        };
    if (susWind >= 34)
        return {
            border: 'border-lime-200 dark:border-lime-800',
            background: 'bg-lime-50 dark:bg-lime-950'
        };
    return {
        border: 'border-blue-200 dark:border-blue-800',
        background: 'bg-blue-50 dark:bg-blue-950'
    };
};
