/*!
 * Defines the TWO parts of the Summary API, used by the Blocks or Webview.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {WmoDate} from "../../WmoCommonDtos.js";

export type ShapeCoordinates = [number, number];

export type ShapeGeometry = {
    type: string;
    bbox?: [number, number, number, number] | null;
    coordinates: ShapeCoordinates | ShapeCoordinates[] | ShapeCoordinates[][] | null;
}

export type ShapeFeature = {
    type: string;
    geometry: ShapeGeometry | null;
    properties: {[key: string]: string} | null;
}

export type FormationChance = {
    level: string;
    chance: number
}

export type TwoAreaOfInterest = {
    title: string | null;
    id: string | null;
    text: string | null;
    twoDay: FormationChance | null;
    sevenDay: FormationChance | null;
    features: ShapeFeature[] | null;
}

export type TwoBasin = {
    issuedBy: string;
    issuedOn: WmoDate | null;
    for: string;
    active: string | null;
    areas: TwoAreaOfInterest[];
    remark: string | null;
}

export type TwoData = {
    basins: {
        atlantic: TwoBasin;
        pacific: TwoBasin;
    };
}