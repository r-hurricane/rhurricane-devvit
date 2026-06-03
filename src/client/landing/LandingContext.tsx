/*!
* Context items for the app landing.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";
import {LandingInitResponse} from "../../shared/api";
import {UserPreferencesDto} from "../../shared/dtos/redis/UserPreferencesDto";

export type LandingContextData = {
    modal: ReactNode | undefined;
    setModal: (modal: ReactNode | undefined) => void;
    data: LandingInitResponse | null | undefined;
    updateUserPreferences: (prefs: UserPreferencesDto) => void;
};

const LandingContext = createContext<LandingContextData | null>(null);

export const LandingProvider = ({
    data,
    setData,
    children
}: {
    data: LandingInitResponse | null | undefined;
    setData: Dispatch<SetStateAction<LandingInitResponse | null | undefined>>;
    children: ReactNode;
}) => {
    const [modal, setModalState] = useState<ReactNode | undefined>(undefined);
    const setModal = (modal: ReactNode | undefined) => {
        setModalState(modal);
    };
    const updateUserPreferences = (prefs: UserPreferencesDto) => {
        setData(s => s ? ({...s, userPreferences: prefs}) : s);
    };
    return (
        <LandingContext.Provider value={{data, modal, setModal, updateUserPreferences}}>
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