/*!
 * Helper for log messages.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SettingsClient} from "@devvit/public-api";
import {AppSettings, LogLevel} from "./AppSettings.js";

export class Logger {

    #label: string;
    #logLevel: LogLevel;

    public static async Create(label: string, settings: SettingsClient): Promise<Logger> {
        return new Logger(label, await AppSettings.GetLogLevel(settings));
    }

    public constructor(label: string, logLevel?: LogLevel) {
        this.#label = label;
        this.#logLevel = logLevel ?? LogLevel.Warn;
    }

    public get logLevel() { return this.#logLevel; }

    public set logLevel(val: LogLevel) { this.#logLevel = val; }

    public trace(...msg: any[]): void {
        if (this.isLogEnabled(LogLevel.Trace))
            console.trace(this.formatMessage(LogLevel.Error, msg));
    }

    public debug(...msg: any[]): void {
        if (this.isLogEnabled(LogLevel.Debug))
            console.debug(this.formatMessage(LogLevel.Error, msg));
    }

    public info(...msg: any[]): void {
        if (this.isLogEnabled(LogLevel.Info))
            console.log(this.formatMessage(LogLevel.Error, msg));
    }

    public warn(...msg: any[]): void {
        if (this.isLogEnabled(LogLevel.Warn))
            console.warn(this.formatMessage(LogLevel.Error, msg));
    }

    public error(...msg: any[]): void {
        if (this.isLogEnabled(LogLevel.Error))
            console.error(this.formatMessage(LogLevel.Error, msg));
    }

    public isLogEnabled(level: LogLevel): boolean {
        return level <= this.#logLevel;
    }

    public getLogDateFormat(): string {
        const d = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
    }

    public formatError(e: Error): string {
        let txt = ``;
        if (e.stack && e.stack.length > 0) {
            txt += `--- Stack Trace:\n${e.stack}\n`;
        }
        const cause = (e as any)?.cause?.stack || (e as any)?.cause;
        if (cause) {
            txt += `--- Cause:\n${cause}\n`;
        }
        return txt.length > 0 ? `\n----------\n${e}\n${txt}----------` : `${e}`;
    }

    public formatMessage(level: LogLevel, ...msg: any[]): string {
        const msgFmt = msg.map(o =>
            o === undefined
                ? '<undefined>'
                : o === null
                    ? '<null>'
                    : o instanceof Error
                        ? this.formatError(o)
                        : (Array.isArray(o) || typeof o === 'object')
                            ? JSON.stringify(o)
                            : `${o}`
        );
        return `${this.getLogDateFormat()} [${this.#label}] ${LogLevel[level].toUpperCase()} - ${msgFmt.join(' ')}`;
    }

}