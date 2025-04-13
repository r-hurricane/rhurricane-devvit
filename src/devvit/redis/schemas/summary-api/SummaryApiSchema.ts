/*!
 * Represents the base container of the summary API data. The specific data points (TWO, ATCF, TCPOD) are separated.
 *
 * THE DEBATE - Zod + z.infer<> vs. Interfaces
 * ==========
 * The summary API is complex, and has multiple structures to support the different breadths of data. I could simply
 * plop the API result into Redis, extract and "cast" with "as". However, if the API data changes unexpectedly, the
 * post would be the one that fails to render.
 *
 * With Zod, I am able to ensure the schema matches in the update job and report it, rather than potentially causing the
 * post to not render. However, it requires a lot of initial setup, potentially duplicated code, and requires a future
 * web-view to require zod, since the shared DTO would require it for the type defs! This could be a performance issue.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SummaryApiTwoSchema} from "./SummaryApiTwoSchemas.js";
import {z, ZodType} from "zod";
import {SummaryApiTcpodSchema} from "./SummaryApiTcpodSchemas.js";
import {SummaryApiAtcfSchema} from "./SummaryApiAtcfSchemas.js";

const SummaryApiDataSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
    return z.object({
        data: dataSchema,
        lastModified: z.number(),
        count: z.number()
    }).strict();
};

export const SummaryApiSchema = z
    .object({
        two: SummaryApiDataSchema(SummaryApiTwoSchema),
        atcf: SummaryApiDataSchema(z.array(SummaryApiAtcfSchema)),
        tcpod: SummaryApiDataSchema(SummaryApiTcpodSchema)
    })
    .strict();