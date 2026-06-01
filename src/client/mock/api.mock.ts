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

export default defineMock([
    {
        url: '/api/landing/init',
        method: 'GET',
        body: {
            isDev: true,
            summaryApiData: example,
            maintenanceMode: 'Soft',
            maintenanceMessage: 'The 2026 Eastern North Pacific Hurricane Season starts May 15th, and the Atlantic and Central North Pacific Hurricane season starts June 1st.',
            userPreferences: {
                speed: "kts",
                distance: 'nmi'
            }
        } satisfies LandingInitResponse
    }
]);