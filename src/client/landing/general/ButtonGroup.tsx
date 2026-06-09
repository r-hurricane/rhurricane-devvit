/*!
 * Button group.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export type ButtonGroupOption<T extends string> = {
    label: string;
    value: T;
    count?: number;
    subCount?: number;
};

export const ButtonGroup = <T extends string,>({
    options,
    selected,
    onSelect
}: {
    options: ButtonGroupOption<T>[];
    selected: string;
    onSelect: (val: T) => void;
}) => {
    return (
        <div className="flex gap-0.5 justify-between items-center text-neutral-content">
            {options.map(o => {
                const style = selected === o.value
                    ? "text-neutral-content-strong border-alienblue-200 dark:border-alienblue-700 bg-alienblue-100 dark:bg-alienblue-700"
                    : ((o.count !== undefined && o.count > 0) || (o.subCount !== undefined && o.subCount > 0))
                        ? "text-puregray-800 dark:text-white border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-800"
                        : "text-puregray-800 dark:text-white border-puregray-200 dark:border-puregray-800 bg-puregray-50 dark:bg-puregray-850";
                return (
                    <button
                        key={o.value}
                        className={`${options.length == 2 ? 'w-1/2' : 'w-1/3'} p-1 flex gap-1 justify-center items-center cursor-pointer rounded-md border ${style}`}
                        onClick={() => o.value !== selected ? onSelect(o.value) : undefined}
                    >
                        <div className={selected === o.value ? "font-semibold" : ""}>{o.label}</div>
                        {o.count !== undefined && (<div className="text-xs">({o.count}{o.subCount !== undefined ? ` - ${o.subCount}` : ''})</div>)}
                    </button>
                );
            })}
        </div>
    );
};