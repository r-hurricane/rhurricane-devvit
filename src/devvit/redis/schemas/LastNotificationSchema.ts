/*!
 * Basic schema for storing the last notification time and text.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from 'zod';

export type LastNotificationDto = z.infer<typeof LastNotificationSchema>;

export const LastNotificationSchema = z
    .object({
        text: z.string(),
        time: z.number()
    })
    .strict();