/*!
* Action to force create a new summary post.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {createSummaryPost} from "../../util/summaryPostUtils";

export const createSummaryPostAction = async () => {
    return await createSummaryPost(
        'Tropical Weather Summary',
        'Tropical Weather Outlook'
    );
};