/*!
 * Helper for defining custom context for summary posts
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {UserPreferencesDto} from "../../../shared/dtos/redis/UserPreferencesDto.js";

export type SummaryContext = {
    blocks: Devvit.Context;
    userPreferences: UserPreferencesDto;
};