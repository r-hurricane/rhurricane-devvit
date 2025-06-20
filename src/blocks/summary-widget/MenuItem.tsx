﻿/*!
 * Renders the menu buttons for the various Tropical Summary pages (TWO, ATCF, TCPOD).
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";

export interface MenuItemProps {
    activePage: string;
    setActivePage: (page: string) => void;
    title: string;
    count: number | undefined;
    disabled: boolean;
}

export const MenuItem = (props: MenuItemProps) => {
    const isActive = !props.disabled && props.activePage === props.title;
    const hasCount = !props.disabled && props.count != undefined && props.count > 0;
    return (
        <hstack
            padding="xsmall"
            border={isActive ? 'thick' : 'thin'}
            cornerRadius="medium"
            lightBackgroundColor={isActive ? 'AlienBlue-100' : (hasCount ? 'Yellow-50' : 'PureGray-50')}
            lightBorderColor={isActive ? 'AlienBlue-700' : (hasCount ? 'Yellow-300' : 'PureGray-300')}
            darkBackgroundColor={isActive ? 'AlienBlue-800' : (hasCount ? 'Yellow-800' : 'PureGray-900')}
            darkBorderColor={isActive ? 'AlienBlue-400' : (hasCount ? 'Yellow-600' : 'PureGray-600')}
            width="33%"
            alignment="middle center"
            onPress={!props.disabled ? (() => props.setActivePage(props.title)) : undefined}
        >
            <text
                size="medium"
                weight={isActive ? 'bold' : 'regular'}
                lightColor={isActive ? 'AlienBlue-900' : ''}
                darkColor={isActive ? 'AlienBlue-50' : ''}
            >
                {props.title}
            </text>
            <spacer size="xsmall"/>
            <text size="small">({!props.disabled && props.count != undefined  ? props.count : '--'})</text>
        </hstack>
    );
};