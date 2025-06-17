/*!
 * Helper for rendering consistent "Announcement" content blocks.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {Container, ContainerProps} from "./Container.js";

export interface AnnouncementProps extends ContainerProps {
    size?: Devvit.Blocks.TextSize;
    weight?: Devvit.Blocks.TextWeight;
    children: Devvit.StringChildren;
}

export const Announcement = (props: AnnouncementProps) => {
    const {size, weight, children, ...containerProps} = props;
    containerProps.padding = containerProps.padding ?? 'xsmall';
    containerProps.colorScheme = containerProps.colorScheme ?? "Yellow";
    containerProps.alignment = containerProps.alignment ?? "middle center";
    return (
        <Container {...containerProps}>
            <text
                size={size ?? "small"}
                weight={weight ?? 'regular'}
                alignment="middle center"
                lightColor="Global-Black"
                darkColor="Global-White"
                wrap
            >{children}</text>
        </Container>
    );
};