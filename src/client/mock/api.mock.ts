/*!
 * Mock data responses for testing locallt.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { defineMock } from 'vite-plugin-mock-dev-server'
import {LandingInitResponse} from "../../shared/api";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import example from './example.json';
import {UserPreferencesDto} from "../../shared/dtos/redis/UserPreferencesDto";

const MockData: LandingInitResponse = {
    isDev: true,
    summaryApiData: example,
    maintenanceMode: 'Soft',
    maintenanceMessage: 'The 2026 Eastern North Pacific Hurricane Season starts May 15th, and the Atlantic and Central North Pacific Hurricane season starts June 1st.',
    userPreferences: {
        speed: "mph",
        distance: 'smi'
    }
};

export default defineMock([
    {
        url: '/api/landing/init',
        method: 'GET',
        body: MockData
    },
    {
        url: '/api/prefs',
        method: 'POST',
        body: (req) => {
            console.log('body: "', req.body, '", type: ', typeof req.body);
            MockData.userPreferences = req.body as UserPreferencesDto;
            return { ok: true };
        }
    }
]);