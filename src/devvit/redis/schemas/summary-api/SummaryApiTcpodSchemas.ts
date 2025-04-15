/*!
 * Defines the TCPOD parts of the Summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from 'zod';
import {WmoCoordinatesSchema, WmoDateRangeSchema, WmoDateSchema} from "./SummaryApiCommonSchemas.js";

export const Nous42HeaderTcpodSchema = z
	.object({
        full: z.string().nullable(),
        tc: z.boolean(),
        yr: z.string().nullable(),
        seq: z.string().nullable()
	})
	.strict();

export const Nous42HeaderSchema = z
	.object({
        awips: z.string().nullable(),
        issued: WmoDateSchema.nullable(),
        start: WmoDateSchema.nullable(),
        end: WmoDateSchema.nullable(),
        tcpod: Nous42HeaderTcpodSchema.nullable(),
        correction: z.boolean().nullable(),
        amendment: z.boolean().nullable()
	})
	.strict();

export const Nous42OutlookSchema = z
	.object({
        negative: z.boolean(),
        text: z.string()
	})
	.strict();

export const Nous42CanceledSchema = z
	.object({
        tcpod: z.string().nullable(),
        mission: z.string().nullable().optional(),
        tcpodYr: z.string().nullable().optional(),
        tcpodSeq: z.string().nullable().optional(),
        required: WmoDateRangeSchema.nullable().optional(),
        canceledAt: WmoDateSchema.optional()
	})
	.strict();

export const Nous42AltitudeSchema = z
	.object({
        upper: z.number().nullable(),
        lower: z.number().nullable()
	})
	.strict();

export const Nous42MissionSchema = z
	.object({
        tcpod: Nous42HeaderTcpodSchema.nullable(),
        name: z.string().nullable(),
        required: WmoDateRangeSchema.nullable(),
        id: z.string().nullable(),
        departure: WmoDateSchema.nullable(),
        coordinates: WmoCoordinatesSchema.nullable(),
        window: WmoDateRangeSchema.nullable(),
        altitude: Nous42AltitudeSchema.nullable(),
        profile: z.string().nullable(),
        wra: z.boolean().nullable(),
        remarks: z.string().nullable()
	})
	.strict();

export const Nous42StormSchema = z
	.object({
        name: z.string().nullable(),
        text: z.string().nullable(),
        missions: z.array(Nous42MissionSchema)
	})
	.strict();

export const Nous42BasinSchema = z
	.object({
        storms: z.array(Nous42StormSchema),
        outlook: z.array(Nous42OutlookSchema),
        remarks: z.array(z.string()),
        canceled: z.array(Nous42CanceledSchema)
	})
	.strict();

export const Nous42Schema = z
	.object({
        header: Nous42HeaderSchema.nullable(),
        atlantic: Nous42BasinSchema.nullable(),
        pacific: Nous42BasinSchema.nullable(),
        note: z.string().nullable()
	})
	.strict();

export const WmoHeaderSegmentSchema = z
    .object({
        major: z.string().nullable(),
        minor: z.string().nullable(),
        last: z.boolean()
    })
    .strict();

export const WmoHeaderSchema = z
    .object({
        sequence: z.number().nullable(),
        designator: z.string().nullable(),
        station: z.string().nullable(),
        datetime: WmoDateSchema.nullable(),
        delay: z.string().nullable(),
        correction: z.string().nullable(),
        amendment: z.string().nullable(),
        segment: WmoHeaderSegmentSchema.nullable()
    })
    .strict();

export const TcpodWmoSchema = z
	.object({
        header: WmoHeaderSchema,
        message: Nous42Schema
	})
	.strict();

export const SummaryApiTcpodSchema = z
	.object({
        today: TcpodWmoSchema.nullable(),
        tomorrow: TcpodWmoSchema.nullable()
	})
	.strict();