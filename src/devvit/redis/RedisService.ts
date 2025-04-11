/*!
 * Service for getting and setting saved Redis data.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {PostMetadataSchema, PostMetadataZod} from "./schemas/PostMetadataSchema.js";
import {SummaryPostMetadataDto} from "../../../shared/dtos/redis/PostMetadataDto.js";

export class RedisService {

    #redis: Devvit.Context['redis'];
    #postMetadataSchema: PostMetadataSchema;

    constructor(redis: Devvit.Context['redis']) {
        this.#redis = redis;
        this.#postMetadataSchema = new PostMetadataSchema();
    }

    public async getPostMetadata(postId: string): Promise<PostMetadataZod | null> {
        const savedJson = await this.#redis.get(this.#postMetadataSchema.redisKey(postId));
        if (!savedJson) return null;

        const parsedJson = await PostMetadataSchema.PostMetadataSchema.parseAsync(JSON.parse(savedJson));
        switch (parsedJson.type) {
            case 'summary':
                return parsedJson satisfies PostMetadataZod;

            default:
                throw new Error(`Post Type ${parsedJson.type} is not yet implemented!`);
        }
    }

    public async savePostMetadata(postId: string, metadata: SummaryPostMetadataDto): Promise<string> {
        return await this.#redis.set(this.#postMetadataSchema.redisKey(postId), JSON.stringify(metadata));
    }

}