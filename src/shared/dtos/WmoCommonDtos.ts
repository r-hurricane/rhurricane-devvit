/*!
 * Defines commonly shared WMO types, used by multiple APIs.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export type WmoDate = {
    iso: string;
    time: number;
}

export type WmoDateRange = {
    start: WmoDate | null;
    end: WmoDate | null;
}

export type WmoCoordinates = {
    lat: number;
    lon: number;
}