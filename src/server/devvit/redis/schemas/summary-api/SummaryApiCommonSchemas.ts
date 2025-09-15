/*!
 * Common schema definitions used by the Summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from "zod";

export const WmoDateSchema = z
    .object({
        iso: z.string().min(1),
        time: z.number()
    });

export const WmoDateRangeSchema = z
    .object({
        start: WmoDateSchema.nullable(),
        end: WmoDateSchema.nullable()
    });

export const WmoCoordinatesSchema = z
    .object({
        lat: z.number(),
        lon: z.number()
    });