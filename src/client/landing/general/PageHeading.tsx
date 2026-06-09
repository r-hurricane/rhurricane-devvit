/*!
* Component that renders the heading of a page.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {IconType} from "react-icons";

export const PageHeading = ({
    Icon,
    heading,
    subHeading
}: {
    Icon: IconType;
    heading: string;
    subHeading: string;
}) => {
    return (
        <div className="w-full p-2 flex items-center gap-2 rounded-md border-1 border-puregray-200 dark:border-puregray-800 bg-white dark:bg-puregray-850 ">
            <Icon className="size-6" strokeWidth={1} />
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="font-semibold">{heading}</div>
                <div className="text-puregray-600 dark:text-puregray-400">{subHeading}</div>
            </div>
        </div>
    );
};
