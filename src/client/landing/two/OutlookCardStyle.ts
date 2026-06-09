/*!
* Helper utility for getting the style of an Outlook Card.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {HiMiniExclamationCircle, HiMiniExclamationTriangle} from "react-icons/hi2";
import {IconType} from "react-icons";

export type OutlookLevel = 'none' | 'low' | 'medium' | 'high';

export type OutlookCardStyle = {
    border: string;
    background: string;
    text: string;
    iconBackground: string;
    Icon: IconType;
};

export const getOutlookCardStyle = (level: OutlookLevel): OutlookCardStyle => {
    return {
        'none': {
            border: 'border-puregray-200 dark:border-puregray-700',
            background: 'bg-puregray-50 dark:bg-puregray-900',
            text: 'text-puregray-600 dark:text-puregray-300',
            iconBackground: 'bg-puregray-200 dark:bg-puregray-700',
            Icon: HiMiniExclamationCircle
        },
        'low': {
            border: 'border-yellow-200 dark:border-yellow-800',
            background: 'bg-yellow-50 dark:bg-yellow-950',
            text: 'text-yellow-600 dark:text-yellow-300',
            iconBackground: 'bg-yellow-200 dark:bg-yellow-700',
            Icon: HiMiniExclamationTriangle
        },
        'medium': {
            border: 'border-yelloworange-200 dark:border-yelloworange-800',
            background: 'bg-yelloworange-50 dark:bg-yelloworange-950',
            text: 'text-yelloworange-600 dark:text-yelloworange-300',
            iconBackground: 'bg-yelloworange-200 dark:bg-yelloworange-700',
            Icon: HiMiniExclamationTriangle
        },
        'high': {
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-600 dark:text-red-300',
            background: 'bg-red-50 dark:bg-red-950',
            iconBackground: 'bg-red-200 dark:bg-red-700',
            Icon: HiMiniExclamationTriangle
        }
    }[level] satisfies OutlookCardStyle;
};
