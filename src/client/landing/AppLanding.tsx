/*!
* The entry into the inline post view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {useEffect, useState} from "react";
import {LandingInitResponse} from "../../shared/api";
import {LoadingOrError} from "../shared/LoadingOrError";
import {Announcement} from "./general/Announcement";
import {TwoPage} from "./two/TwoPage";
import {ErrorBoundary} from "react-error-boundary";
import {LandingProvider} from "./LandingContext";
import {ModalHost} from "./general/ModalHost";
import {Footer} from "./Footer";
import {ButtonGroup, ButtonGroupOption} from "./general/ButtonGroup";
import {AtcfPage} from "./atcf/AtcfPage";
import {CurrentStorm} from "./general/CurrentStorm";
import {TcpodPage} from "./tcpod/TcpodPage";

type AppTab = 'two' | 'atcf' | 'tcpod';

export const AppLanding = () => {

    // Fetch landing page data
    const [data, setData] = useState<LandingInitResponse | null | undefined>(undefined);
    const apiData = data?.summaryApiData;
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

    const [activeTab, setActiveTab] = useState<AppTab>('two');

    // Show loading screen
    if (!data) {
        return (
            <LoadingOrError error={data === null}/>
        );
    }
    
    // Setup app announcement
    const now = new Date().getTime();
    const announcement = data && data.maintenanceMode === 'Soft'
        ? (<Announcement>{data.maintenanceMessage ? data.maintenanceMessage : 'App maintenance underway.'}</Announcement>)
        : apiData && !!apiData.message && apiData.message.start <= now && apiData.message.end >= now
            ? (<Announcement colorScheme={apiData.message.colorScheme}>{apiData.message.text}</Announcement>)
            : null;

    // Split current storm list into groups of 3
    const currentStorms = [];
    if (apiData?.currentStorms?.data && apiData.currentStorms.data.length > 0) {
        const apiStorms = apiData.currentStorms.data;
        apiStorms.sort((a,b) => {
            return a.binNumber > b.binNumber ? 1 : a.binNumber < b.binNumber ? -1 : 0;
        });
        for (let i = 0; i < apiStorms.length; i += 3) {
            const batch = apiData.currentStorms.data.slice(i, i + 3);
            const storms = [];
            for (let j = 0; j < 3; ++j) {
                const storm = batch[j];
                if (storm) {
                    storms.push(<CurrentStorm storm={storm} />);
                }
            }
            currentStorms.push((
                <div className="w-full flex gap-2">
                    {storms}
                </div>
            ));
        }
    }

    // Process tab button information
    const tabOptions = [
        {label: 'TWO', value: 'two', count: data.summaryApiData?.two.count ?? 0},
        {label: 'ATCF', value: 'atcf', count: data.summaryApiData?.atcf.count ?? 0},
        {label: 'TCPOD', value: 'tcpod', count: data.summaryApiData?.tcpod.count ?? 0}
    ] satisfies ButtonGroupOption<AppTab>[];

    return (
        <ErrorBoundary fallback={<LoadingOrError error={true}/>} onError={console.error}>
            <LandingProvider data={data} setData={setData}>
                <div className="w-full h-full flex flex-col justify-between">
                    <div className="w-full flex-1 min-h-0 flex flex-col p-2 gap-2">
                        {announcement}
                        {currentStorms}
                        <ButtonGroup options={tabOptions} selected={activeTab} onSelect={setActiveTab}/>
                        {activeTab === 'two' && (<TwoPage key="twoPage" twoData={data.summaryApiData?.two}/>)}
                        {activeTab === 'atcf' && (<AtcfPage key="atcfPage" atcfData={data.summaryApiData?.atcf}/>)}
                        {activeTab === 'tcpod' && (<TcpodPage key="tcpodPage" tcpodData={data.summaryApiData?.tcpod}/>)}
                    </div>
                    <Footer/>
                </div>
                <ModalHost/>
            </LandingProvider>
        </ErrorBoundary>
    );
};