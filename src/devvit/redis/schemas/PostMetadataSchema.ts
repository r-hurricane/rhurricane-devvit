/*!
 * Saves basic metadata of a post, such as post type and basic identifying information.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {BaseRedisSchema, RedisKeyParam} from "./BaseRedisSchema.js";
import {z} from 'zod';

export type PostMetadataZod = z.input<typeof PostMetadataSchema.PostMetadataSchema>;

export class PostMetadataSchema extends BaseRedisSchema {

    public override redisKey(params: string): string {
        return `rhurricane:postmeta:${params[0]}`;
    }

    public static readonly PostMetadataSchema = z
        .object({
            type: z.enum(['summary', 'storm', 'recon'])
        })
        .strict();

}