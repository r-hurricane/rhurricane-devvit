/*!
 * Defines the Summary API data.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export interface IWmoDateRange {
    start: IWmoDate | null;
    end: IWmoDate | null;
}

export interface IWmoDate {
    iso: string;
    time: number;
}

export interface IWmoCoordinates {
    lat: number;
    lon: number;
}

export type TShapeCoordinates = [number, number];

export interface IShapeGeometry {
    type: string;
    bbox: [number, number, number, number] | null;
    coordinates: TShapeCoordinates | TShapeCoordinates[] | TShapeCoordinates[][] | null;
}

export interface IShapeFeature {
    type: string;
    geometry: IShapeGeometry | null;
    properties: {[key: string]: string} | null;
}

export interface IFormationChance {
    level: string;
    chance: number
}

export interface IAbxx20AreaOfInterest {
    title: string | null;
    id: string | null;
    text: string | null;
    twoDay: IFormationChance | null;
    sevenDay: IFormationChance | null;
    features: IShapeFeature[] | null;
}

export interface TwoBasin {
    issuedBy: string;
    issuedOn: IWmoDate | null;
    for: string;
    active: string | null;
    areas: IAbxx20AreaOfInterest[];
    remark: string | null;
}

export interface TwoData {
    basins: {
        atlantic: TwoBasin;
        pacific: TwoBasin;
    };
}


export interface IAtcfRad {
    rad: number | null,
    code: string | null,
    ne: number | null,
    se: number | null,
    sw: number | null,
    nw: number | null,
}

export interface IAtcfStormCode {
    ba: string | null,
    id: string | null,
    yr: string | null
}

export interface IAtcfFromTo {
    from: IAtcfStormCode,
    to: IAtcfStormCode
}

export interface IAtcfData {
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

export interface AtcfData {
    data: IAtcfData[];
    genNo: number | null;
    invest: IAtcfFromTo | null;
    trans: IAtcfFromTo | null;
    diss: IAtcfFromTo | null;
}

export interface INous42HeaderTcpod {
    full: string | null;
    tc: boolean,
    yr: string | null;
    seq: string | null;
}

export interface INous42Header {
    awips: string | null;
    issued: IWmoDate | null;
    start: IWmoDate | null;
    end: IWmoDate | null;
    tcpod: INous42HeaderTcpod | null;
    correction: boolean | null;
    amendment: boolean | null;
}

export interface INous42Outlook {
    negative: boolean;
    text: string;
}

export interface INous42Canceled {
    tcpod: string | null;
    mission?: string | null;
    tcpodYr?: string | null;
    tcpodSeq?: string | null;
    required?: IWmoDateRange | null;
    canceledAt?: IWmoDate;
}

export interface INous42Altitude {
    upper: number | null;
    lower: number | null;
}

export interface INous42Mission {
    tcpod: INous42HeaderTcpod | null;
    name: string | null;
    required: IWmoDateRange | null;
    id: string | null;
    departure: IWmoDate | null;
    coordinates: IWmoCoordinates | null;
    window: IWmoDateRange | null;
    altitude: INous42Altitude | null;
    profile: string | null;
    wra: boolean | null;
    remarks: string | null;
}

export interface INous42Storm {
    name: string | null;
    text: string | null;
    missions: INous42Mission[]
}

export interface INous42Basin {
    storms: INous42Storm[];
    outlook: INous42Outlook[];
    remarks: string[];
    canceled: INous42Canceled[];
}

export interface INous42 {
    header: INous42Header | null;
    atlantic: INous42Basin | null;
    pacific: INous42Basin | null;
    note: string | null;
}

export interface TcpodWmo {
    message: INous42;
}

export interface TcpodData {
    today: TcpodWmo | null;
    tomorrow: TcpodWmo | null;
}

export interface SummaryApiData<TData> {
    data: TData;
    lastModified: number;
    count: number;
}

export interface SummaryApi {
    two: SummaryApiData<TwoData>;
    atcf: SummaryApiData<AtcfData[]>;
    tcpod: SummaryApiData<TcpodData>;
}