/*!
 * Helper methods for getting a hurricane wind category.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export enum WindCategory {
    UNKN = "Unknown",
    TD = "Tropical Depression",
    TS = "Tropical Storm",
    CAT1 = "Category 1",
    CAT2 = "Category 2",
    CAT3 = "Category 3",
    CAT4 = "Category 4",
    CAT5 = "Category 5"
}

export const getWindCategory =
    (susWind: number | null | undefined): WindCategory => {
        if (!susWind || isNaN(susWind)) return WindCategory.UNKN;
        if (susWind >= 137) return WindCategory.CAT5;
        if (susWind >= 113) return WindCategory.CAT4;
        if (susWind >= 96) return WindCategory.CAT3;
        if (susWind >= 83) return WindCategory.CAT2;
        if (susWind >= 64) return WindCategory.CAT1;
        if (susWind >= 34) return WindCategory.TS;
        return WindCategory.TD;
    };