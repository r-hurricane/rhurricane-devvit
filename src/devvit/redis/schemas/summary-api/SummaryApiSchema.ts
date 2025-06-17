/*!
 * Represents the base container of the summary API data. The specific data points (TWO, ATCF, TCPOD) are separated.
 *
 * Please see comment in /shared/dtos/redis/summary-api/SummaryApiDtos.ts about "THE DEBATE"
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SummaryApiTwoSchema} from "./SummaryApiTwoSchemas.js";
import {z, ZodType} from "zod";
import {SummaryApiTcpodSchema} from "./SummaryApiTcpodSchemas.js";
import {SummaryApiAtcfSchema} from "./SummaryApiAtcfSchemas.js";

const SummaryMessageSchema = z
    .object({
        text: z.string(),
        start: z.number(),
        end: z.number(),
        colorScheme: z.string().optional()
    });

const SummaryCurrentStormSchema = z
    .object({
        id: z.string(),
        binNumber: z.string(),
        name: z.string(),
        classification: z.string(),
        intensity: z.string(),
        pressure: z.string(),
        latitude: z.string(),
        longitude: z.string(),
        latitudeNumeric: z.number(),
        longitudeNumeric: z.number(),
        movementDir: z.number(),
        movementSpeed: z.number(),
        lastUpdate: z.string()
    });

const SummaryApiDataSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
    return z.object({
        data: dataSchema,
        lastModified: z.number().nullable(),
        count: z.number()
    });
};

export type SummaryApiSchemaType = z.infer<typeof SummaryApiAtcfSchema>;

export const SummaryApiSchema = z
    .object({
        message: SummaryMessageSchema.nullish(),
        currentStorms: SummaryApiDataSchema(z.array(SummaryCurrentStormSchema)),
        two: SummaryApiDataSchema(SummaryApiTwoSchema),
        atcf: SummaryApiDataSchema(z.array(SummaryApiAtcfSchema)),
        tcpod: SummaryApiDataSchema(SummaryApiTcpodSchema)
    })
    .strict();