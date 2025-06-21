/*!
 * Defines the TWO parts of the Summary API.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from "zod";
import {WmoDateSchema} from "./SummaryApiCommonSchemas.js";

export const ShapeCoordinatesSchema = z.tuple([z.number(), z.number()]);

export const ShapeGeometrySchema = z
    .object({
        type: z.string(),
        bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).nullable().optional(),
        coordinates: z.union([
            ShapeCoordinatesSchema,
            z.array(ShapeCoordinatesSchema),
            z.array(z.array(ShapeCoordinatesSchema))
        ]).nullable()
    });

export const ShapeFeatureSchema = z
    .object({
        type: z.string(),
        geometry: ShapeGeometrySchema.nullable(),
        properties: z.record(z.string(), z.string()).nullable()
    });

export const FormationChanceSchema = z
    .object({
        level: z.string(),
        chance: z.number()
    });

export const TwoAreaOfInterestSchema = z
    .object({
        title: z.string().nullable(),
        id: z.string().nullable(),
        text: z.string().nullable(),
        twoDay: FormationChanceSchema.nullable(),
        sevenDay: FormationChanceSchema.nullable(),
        features: z.array(ShapeFeatureSchema).nullable()
    });

export const TwoBasinSchema = z
    .object({
        issuedBy: z.string(),
        issuedOn: WmoDateSchema.nullable(),
        for: z.string(),
        active: z.string().nullable(),
        areas: z.array(TwoAreaOfInterestSchema),
        remark: z.string().nullable()
    });

export const SummaryApiTwoSchema = z
    .object({
        basins: z.object({
            atlantic: TwoBasinSchema,
            pacific: TwoBasinSchema
        })
    });