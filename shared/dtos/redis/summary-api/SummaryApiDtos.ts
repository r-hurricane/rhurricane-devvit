/*!
 * Represents the base container of the summary API data. The specific data points (TWO, ATCF, TCPOD) are separated.
 *
 * THE DEBATE - Zod use z.infer<> vs. Interfaces + "satisfies" keyword
 * ==========
 * The summary API is complex, and has multiple structures to support the different breadths of data. I could simply
 * plop the API result into Redis, extract and "cast" with "as". However, if the API data changes unexpectedly, the
 * post would be the one that fails to render.
 *
 * With Zod, I am able to ensure the schema matches in the update job and report it, rather than potentially causing the
 * post to not render. However, it requires a lot of initial setup, potentially duplicated code, and requires a future
 * web-view to require zod, since the shared DTO would require it for the type defs! This could be a performance issue.
 *
 * I have decided the "duplicated" DTOs + Schema definitions are "worth it", due to the security of knowing the WebViews
 * do not have to depend on Zod (or my parse libraries) and can validate the Schema matches what Blocks / Webview use to
 * render the data! This way Devvit stays independent!
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {TwoData} from "./SummaryApiTwoDtos.js";
import {AtcfData} from "./SummaryApiAtcfDtos.js";
import {TcpodData} from "./SummaryApiTcpodDtos.js";

export type SummaryApiData<TData> = {
    data: TData;
    lastModified: number;
    count: number;
}

export type SummaryApiDto = {
    two: SummaryApiData<TwoData>;
    atcf: SummaryApiData<AtcfData[]>;
    tcpod: SummaryApiData<TcpodData>;
}