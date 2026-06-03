/*!
 * Modal that displays the data disclaimer.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {useLandingContext} from "../LandingContext";
import {ButtonGroup, ButtonGroupOption} from "./ButtonGroup";
import {useState} from "react";
import {DistancePreference, SpeedPreference} from "../../../shared/dtos/redis/UserPreferencesDto";
import {LoadingOrError} from "../../shared/LoadingOrError";

const speedOptions = [
    { label: 'kts', value: 'kts' },
    { label: 'mph', value: 'mph' },
    { label: 'km/h', value: 'kph' },
    { label: 'm/s', value: 'mps' },
] satisfies ButtonGroupOption<SpeedPreference>[];

const distanceOptions = [
    { label: 'nmi', value: 'nmi' },
    { label: 'mi', value: 'smi' },
    { label: 'km', value: 'km' },
] satisfies ButtonGroupOption<DistancePreference>[];

export const SettingsModal = () => {
    const {data, setModal, updateUserPreferences} = useLandingContext();
    const [speed, setSpeed] = useState<SpeedPreference>(() => data?.userPreferences?.speed ?? 'kts');
    const [distance, setDistance] = useState<DistancePreference>(() => data?.userPreferences?.distance ?? 'nmi');
    const [saving, setSaving] = useState<boolean | undefined>(undefined);
    const savePreferences = async () => {
        setSaving(true);
        try {
            const prefs = {speed, distance};
            const api = await fetch('/api/prefs', { method: 'POST', body: JSON.stringify(prefs), headers: { 'Content-Type': 'application/json' } });
            if (api.ok) {
                updateUserPreferences(prefs);
                setModal(undefined);
            } else {
                setSaving(false);
            }
        } catch (e) {
            setSaving(false);
        }
    };
    return (
        <div className="z-50 fixed inset-0 w-full h-full p-4 text-xs flex flex-col gap-2 bg-white dark:bg-puregray-950 text-neutral-content">
            <h2 className="text-lg font-bold">Unit Preferences</h2>
            <h3 className="border-t text-base font-semibold">Speed</h3>
            <ButtonGroup options={speedOptions} selected={speed} onSelect={setSpeed} />
            <h3 className="border-t text-base font-semibold">Distance</h3>
            <ButtonGroup options={distanceOptions} selected={distance} onSelect={setDistance} />
            <div className="border-t flex justify-between py-2 font-bold">
                <button
                    onClick={() => setModal(undefined)}
                    className="p-2 flex gap-1 justify-center items-center cursor-pointer rounded-full bg-puregray-200 dark:bg-puregray-700"
                >
                    Close
                </button>
                <button
                    onClick={savePreferences}
                    className="p-2 flex gap-1 justify-center items-center cursor-pointer rounded-full text-white bg-alienblue-700"
                >
                    Save
                </button>
            </div>
            {saving !== undefined && (saving
                ? (<LoadingOrError message="Saving..." />)
                : (<div className="text-danger-plain">Sorry, failed to save preferences. Try again...</div>)
            )}
        </div>
    );
};