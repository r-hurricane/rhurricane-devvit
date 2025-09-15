/*!
 * Defines the ATCF parts of the Summary API, used by the Blocks or Webview.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export type IAtcfRad = {
    rad: number | null,
    code: string | null,
    ne: number | null,
    se: number | null,
    sw: number | null,
    nw: number | null,
}

export type IAtcfStormCode = {
    ba: string | null,
    id: string | null,
    yr: string | null
}

export type IAtcfFromTo = {
    from: IAtcfStormCode,
    to: IAtcfStormCode
}

export type IAtcfData = {
    basin: string | null;
    stormNo: number | null;
    date: string | null;
    techNum: string | null;
    tech: string | null;
    tau: number | null;
    lat: number | null;
    lon: number | null;
    maxSusWind: number | null;
    minSeaLevelPsur: number | null;
    levelCode: string | null;
    level: string | null;
    windRad: IAtcfRad | null;
    outerPsur: number | null;
    outerRad: number | null;
    maxWindRad: number | null;
    windGust: number | null;
    eyeDia: number | null;
    subRegion: string | null;
    maxSeas: number | null;
    forecaster: string | null;
    dir: number | null;
    speed: number | null;
    name: string | null;
    depth: string | null;
    seaRad: IAtcfRad | null;
    userData: {[key: string]: string};
    genNo: number | null;
    invest: IAtcfFromTo | null;
    trans: IAtcfFromTo | null;
    diss: IAtcfFromTo | null;
}

export type AtcfData = {
    data: IAtcfData[];
    genNo: number | null;
    invest: IAtcfFromTo | null;
    trans: IAtcfFromTo | null;
    diss: IAtcfFromTo | null;
}