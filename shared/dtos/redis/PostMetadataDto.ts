/*!
 * Represents the basic metadata of a post, such as post type and basic identifying information.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {BaseRedisDto} from "./BaseRedisDto.js";

export type PostType = 'summary' | 'storm' | 'recon';

export type PostMetadataDto = BaseRedisDto & {
    type: PostType;
}

export type SummaryPostMetadataDto = PostMetadataDto;