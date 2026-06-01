/*!
 * Helper for rendering consistent "Announcement" content blocks.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import React from "react";

export interface AnnouncementProps {
    colorScheme?: string | undefined;
    children: React.ReactNode;
}

export const Announcement = ({colorScheme, children}: AnnouncementProps) => {
    let style = 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900';
    switch (colorScheme?.toLowerCase()) {
        case 'red':
            style = 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900';
    }
    return (
        <div className={`w-full p-1 flex items-center font-light text-nuetral-content text-center border rounded-md ${style}`}>
            {children}
        </div>
    );
};