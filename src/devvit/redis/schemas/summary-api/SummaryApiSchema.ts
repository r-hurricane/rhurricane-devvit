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
        lightBgColor: z.string().optional(),
        lightColor: z.string().optional(),
        darkColor: z.string().optional(),
        lightBrColor: z.string().optional(),
        darkBrColor: z.string().optional()
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
        two: SummaryApiDataSchema(SummaryApiTwoSchema),
        atcf: SummaryApiDataSchema(z.array(SummaryApiAtcfSchema)),
        tcpod: SummaryApiDataSchema(SummaryApiTcpodSchema)
    })
    .strict();