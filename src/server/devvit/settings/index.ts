/*!
* Register setting validation handlers.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Hono, Context} from 'hono';
import type { SettingsValidationRequest, SettingsValidationResponse } from '@devvit/web/shared';

export const settings = new Hono();

const validationHandler = <T>(handler: (value: T | undefined) => void | string) => {
    return async (c: Context) => {
        const {value} = await c.req.json<SettingsValidationRequest<T>>();

        const validationError = handler(value);

        return validationError
            ? c.json<SettingsValidationResponse>({success: false, error: validationError})
            : c.json<SettingsValidationResponse>({success: true});
    };
};

settings.post('/validate-summary-update-freq', validationHandler<number>(value => {
    if (!value || value < 1)
        return 'Frequency must be at least 1';
    if (value > 60)
        return 'Frequency must be 60 or less';
}));

settings.post('/validate-summary-stale-hours', validationHandler<number>(value => {
    if (!value || value < 1)
        return 'Frequency must be at least 1';
}));

settings.post('/validate-automate-repost-freq', validationHandler<number>(value => {
    if (value === undefined || value < 0)
        return 'Value must be a positive number or zero (0).';
    if (value > 0 && value < 6)
        return 'Value must be 0 or at least 6.';
}));

settings.post('/validate-discord-noti-url', validationHandler<string>(value => {
    if (value && value.length > 0 &&
        !value.startsWith('https://discord.com/api/webhooks')
    ) {
        return `Value must be a valid discord webhook URL.`;
    }
}));

settings.post('/validate-noti-silence', validationHandler<number>(value => {
    if (value === undefined || value < 0)
        return 'Value must be a positive number or zero (0).';
}));