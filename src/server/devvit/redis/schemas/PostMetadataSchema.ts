/*!
 * Saves basic metadata of a post, such as post type and basic identifying information.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from 'zod';

export const PostMetadataSchema = z
    .object({
        type: z.enum(['summary', 'storm', 'recon'])
    });
