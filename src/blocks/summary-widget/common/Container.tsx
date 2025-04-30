/*!
 * Helper for rendering consistent container styles.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";

export interface ContainerProps {
    padding?: Devvit.Blocks.ContainerPadding;
    height?: Devvit.Blocks.SizeString;
    alignment?: Devvit.Blocks.Alignment;
    border?: Devvit.Blocks.ContainerBorderWidth;
    cornerRadius?: Devvit.Blocks.ContainerCornerRadius;
    colorScheme?: string;
    children: Devvit.ElementChildren;
}

export const Container = (props: ContainerProps) => {
    return (
        <vstack
            padding={props.padding ?? "small"}
            height={props.height}
            alignment={props.alignment ?? "top start"}
            border={props.border ?? "thin"}
            cornerRadius={props.cornerRadius ?? "medium"}
            lightBackgroundColor={`${props.colorScheme ?? 'PureGray'}-50`}
            darkBackgroundColor={`${props.colorScheme ?? 'PureGray'}-900`}
            lightBorderColor={`${props.colorScheme ?? 'PureGray'}-300`}
            darkBorderColor={`${props.colorScheme ?? 'PureGray'}-600`}
        >
            {props.children}
        </vstack>
    );
};