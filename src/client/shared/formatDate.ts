/*!
 * Helper methods for rendering dates.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export const formatDate =
    (param: Date | number | undefined | null, undefVal: string = '', showYear: boolean = true): string => {
        const d = typeof param === "number" ? new Date(param < 10000000000 ? param * 1000 : param) : param;
        if (!d || isNaN(d.getTime())) return undefVal;
        const p = (n: number): string => n.toString().padStart(2, '0');
        return `${showYear ? d.getUTCFullYear().toString() + '-' : ''}${p(d.getUTCMonth()+1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}z`;
    };