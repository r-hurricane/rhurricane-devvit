/*!
* The entry into the inline post view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {useEffect, useState} from "react";
import {LandingInitResponse} from "../../shared/api";
import {LoadingOrError} from "../shared/LoadingOrError";
import {Announcement} from "./Announcement";
import {TwoPage} from "./two/TwoPage";
import {ErrorBoundary} from "react-error-boundary";
import {LandingProvider} from "./LandingContext";
import {ModalHost} from "./ModalHost";

export const AppLanding = () => {

    // Fetch landing page data
    const [data, setData] = useState<LandingInitResponse | null | undefined>(undefined);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const initData = await fetch('/api/landing/init');
                setData(initData.ok ? await initData.json() : null);
            } catch (err) {
                console.log('[RHurricane - Landing] Error fetching init data: ', err);
                setData(undefined);
            }
        };
        void fetchData();
    }, []);

    // Show loading screen
    if (!data) {
        return (
            <LoadingOrError error={data === null} />
        );
    }

    return (
        <ErrorBoundary fallback={<LoadingOrError error={true} />} onError={console.error}>
            <LandingProvider data={data}>
                <div className="w-full h-full flex flex-col p-2 gap-2">
                    <Announcement>This is a test message. It can be quite long, depending on the message that needs displayed. I am adding another sentence to act like a longer message to test with.</Announcement>
                    <div className="flex gap-0.5 justify-between items-center text-neutral-content">
                        <button className="w-1/3 p-1 flex gap-1 justify-center items-center cursor-pointer text-alienblue-700 dark:text-white rounded-md border border-alienblue-200 dark:border-alienblue-700 bg-alienblue-100 dark:bg-alienblue-700 text-neutral-content-strong">
                            <div className="font-semibold">TWO</div>
                            <div className="text-xs">(1)</div>
                        </button>
                        <button className="w-1/3 p-1 flex gap-1 justify-center items-center cursor-pointer text-puregray-600 dark:text-white rounded-md border-1 border-puregray-200 dark:border-puregray-800 bg-puregray-50 dark:bg-puregray-850">
                            <div className="">TWO</div>
                            <div className="">(1)</div>
                        </button>
                        <button className="w-1/3 p-1 flex gap-1 justify-center items-center cursor-pointer text-puregray-600 dark:text-white rounded-md border-1 border-puregray-200 dark:border-puregray-800 bg-puregray-50 dark:bg-puregray-850">
                            <div className="">TWO</div>
                            <div className="">(1)</div>
                        </button>
                    </div>
                    {data?.summaryApiData?.two && (<TwoPage key="twoPage" twoData={data.summaryApiData.two} />)}
                </div>
                <ModalHost />
            </LandingProvider>
        </ErrorBoundary>
    );
};