/*!
* Context items for the app landing.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {createContext, ReactNode, useContext, useState} from "react";
import {LandingInitResponse} from "../../shared/api";

export type LandingContextData = {
    modal: ReactNode | undefined;
    setModal: (modal: ReactNode | undefined) => void;
    data: LandingInitResponse | null | undefined;
};

const LandingContext = createContext<LandingContextData | null>(null);

export const LandingProvider = ({
    data,
    children
}: {
    data: LandingInitResponse | null | undefined;
    children: ReactNode;
}) => {
    const [modal, setModalState] = useState<ReactNode | undefined>(undefined);
    const setModal = (modal: ReactNode | undefined) => {
        setModalState(modal);
    };
    return (
        <LandingContext.Provider value={{data, modal, setModal}}>
            {children}
        </LandingContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLandingContext = () => {
    const ctx = useContext(LandingContext);
    if (!ctx) throw new Error('useLandingContext must be used within LandingProvider');
    return ctx;
};