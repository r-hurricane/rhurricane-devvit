/*!
 * Service for getting and setting saved Redis data.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {PostMetadataSchema} from "./schemas/PostMetadataSchema.js";
import {SummaryPostMetadataDto} from "../../../shared/dtos/redis/PostMetadataDto.js";
import {SummaryApiDto} from "../../../shared/dtos/redis/summary-api/SummaryApiDtos.js";
import {SummaryApiSchema} from "./schemas/summary-api/SummaryApiSchema.js";

export class RedisService {

    #redis: Devvit.Context['redis'];

    #redisKeys = {
        postMetadata: (params: string) => `rhurricane:postmeta:${params[0]}`,
        summaryApiLastModified: () => `rhurricane:summaryapi:last_modified`,
        summaryApiData: () => `rhurricane:summaryapi:data`
    };

    constructor(redis: Devvit.Context['redis']) {
        this.#redis = redis;
    }

    /* ========================= */
    /* ===== Post Metadata ===== */
    /* ========================= */
    public async getPostMetadata(postId: string): Promise<SummaryPostMetadataDto | null> {
        const savedJson = await this.#redis.get(this.#redisKeys.postMetadata(postId));
        if (!savedJson) return null;

        const parsedJson = await PostMetadataSchema.parseAsync(JSON.parse(savedJson));
        switch (parsedJson.type) {
            case 'summary':
                return parsedJson satisfies SummaryPostMetadataDto;

            default:
                throw new Error(`Post Type ${parsedJson.type} is not yet implemented!`);
        }
    }

    public async savePostMetadata(postId: string, metadata: SummaryPostMetadataDto): Promise<string> {
        return await this.#redis.set(this.#redisKeys.postMetadata(postId), JSON.stringify(metadata));
    }

    /* ================================= */
    /* ===== Summary Last Modified ===== */
    /* ================================= */
    public async getSummaryApiLastModified(): Promise<string | undefined> {
        return await this.#redis.get(this.#redisKeys.summaryApiLastModified());
    }

    public async saveSummaryApiLastModified(lastModified: string): Promise<void> {
        await this.#redis.set(this.#redisKeys.summaryApiLastModified(), lastModified);
    }

    /* ============================ */
    /* ===== Summary API Data ===== */
    /* ============================ */
    public async getSummaryApiData(): Promise<SummaryApiDto | null> {
        const savedJson = await this.#redis.get(this.#redisKeys.summaryApiData());
        if (!savedJson) return null;

        const parsedJson = await SummaryApiSchema.parseAsync(JSON.parse(savedJson));
        return parsedJson satisfies SummaryApiDto;
    }

    public async saveSummaryApiData(summaryApiData: any): Promise<string> {
        await SummaryApiSchema.parseAsync(summaryApiData);
        return await this.#redis.set(this.#redisKeys.summaryApiData(), JSON.stringify(summaryApiData));
    }

}