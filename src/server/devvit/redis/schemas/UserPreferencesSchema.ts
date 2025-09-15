/*!
 * Saves the preferences of a user.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {z} from 'zod';

export const UserPreferencesSchema = z
    .object({
        speed: z.enum(['kts', 'mph', 'kph', 'mps']),
        distance: z.enum(['nmi', 'smi', 'km'])
    });
