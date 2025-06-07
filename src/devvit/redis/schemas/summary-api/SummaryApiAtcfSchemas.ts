/*!
 * Defines the ATCF parts of the Summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from 'zod';

export const AtcfRadSchema = z
	.object({
        rad: z.number().nullable(),
        code: z.string().nullable(),
        ne: z.number().nullable(),
        se: z.number().nullable(),
        sw: z.number().nullable(),
        nw: z.number().nullable()
	});

export const AtcfStormCodeSchema = z
	.object({
        ba: z.string().nullable(),
        id: z.string().nullable(),
        yr: z.string().nullable()
	});

export const AtcfFromToSchema = z
	.object({
        from: AtcfStormCodeSchema,
        to: AtcfStormCodeSchema
	});

export const AtcfDataSchema = z
	.object({
        basin: z.string().nullable(),
        stormNo: z.number().nullable(),
        date: z.string().nullable(),
        techNum: z.string().nullable(),
        tech: z.string().nullable(),
        tau: z.number().nullable(),
        lat: z.number().nullable(),
        lon: z.number().nullable(),
        maxSusWind: z.number().nullable(),
        minSeaLevelPsur: z.number().nullable(),
        levelCode: z.string().nullable(),
        level: z.string().nullable(),
        windRad: AtcfRadSchema.nullable(),
        outerPsur: z.number().nullable(),
        outerRad: z.number().nullable(),
        maxWindRad: z.number().nullable(),
        windGust: z.number().nullable(),
        eyeDia: z.number().nullable(),
        subRegion: z.string().nullable(),
        maxSeas: z.number().nullable(),
        forecaster: z.string().nullable(),
        dir: z.number().nullable(),
        speed: z.number().nullable(),
        name: z.string().nullable(),
        depth: z.string().nullable(),
        seaRad: AtcfRadSchema.nullable(),
        userData: z.record(z.string(), z.string()),
        genNo: z.number().nullable(),
        invest: AtcfFromToSchema.nullable(),
        trans: AtcfFromToSchema.nullable(),
        diss: AtcfFromToSchema.nullable()
	});

export const SummaryApiAtcfSchema = z
	.object({
        data: z.array(AtcfDataSchema),
        genNo: z.number().nullable(),
        invest: AtcfFromToSchema.nullable(),
        trans: AtcfFromToSchema.nullable(),
        diss: AtcfFromToSchema.nullable()
	});