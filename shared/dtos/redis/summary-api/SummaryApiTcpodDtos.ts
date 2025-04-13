/*!
 * Defines the TCPOD parts of the Summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {WmoDate, WmoDateRange, WmoCoordinates} from "../../WmoCommonDtos.js";

export type Nous42HeaderTcpod = {
    full: string | null;
    tc: boolean,
    yr: string | null;
    seq: string | null;
}

export type Nous42Header = {
    awips: string | null;
    issued: WmoDate | null;
    start: WmoDate | null;
    end: WmoDate | null;
    tcpod: Nous42HeaderTcpod | null;
    correction: boolean | null;
    amendment: boolean | null;
}

export type Nous42Outlook = {
    negative: boolean;
    text: string;
}

export type Nous42Canceled = {
    tcpod: string | null;
    mission?: string | null;
    tcpodYr?: string | null;
    tcpodSeq?: string | null;
    required?: WmoDateRange | null;
    canceledAt?: WmoDate;
}

export type Nous42Altitude = {
    upper: number | null;
    lower: number | null;
}

export type Nous42Mission = {
    tcpod: Nous42HeaderTcpod | null;
    name: string | null;
    required: WmoDateRange | null;
    id: string | null;
    departure: WmoDate | null;
    coordinates: WmoCoordinates | null;
    window: WmoDateRange | null;
    altitude: Nous42Altitude | null;
    profile: string | null;
    wra: boolean | null;
    remarks: string | null;
}

export type Nous42Storm = {
    name: string | null;
    text: string | null;
    missions: Nous42Mission[]
}

export type Nous42Basin = {
    storms: Nous42Storm[];
    outlook: Nous42Outlook[];
    remarks: string[];
    canceled: Nous42Canceled[];
}

export type Nous42 = {
    header: Nous42Header | null;
    atlantic: Nous42Basin | null;
    pacific: Nous42Basin | null;
    note: string | null;
}

export type TcpodWmo = {
    message: Nous42;
}

export type TcpodData = {
    today: TcpodWmo | null;
    tomorrow: TcpodWmo | null;
}