/*!
 * Helper for rendering consistent "Nothing to see here" content blocks.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";
import {Container, ContainerProps} from "./Container.js";

export interface NoDetailsProps extends ContainerProps {
    size?: Devvit.Blocks.TextSize;
    weight?: Devvit.Blocks.TextWeight;
    children: Devvit.StringChildren;
}

export const NoDetails = (props: NoDetailsProps) => {
    const {size, weight, children, ...containerProps} = props;
    containerProps.height = containerProps.height ?? "100px";
    containerProps.alignment = containerProps.alignment ?? "middle center";
    return (
        <Container {...containerProps}>
            <text size={size ?? "xlarge"} weight={weight} wrap>{children}</text>
        </Container>
    );
};