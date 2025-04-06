/*!
 * The DataUpdater job will periodically check the rhurricane.net APIs for changes in hurricane data. If there are data
 * updates, it then:
 * > Saves required data in Redis for faster access/rendering in
 *   - SummaryWidget
 *   - StormWidget (future)
 *   - ReconWidget (future)
 * > (Planned) Updates the community sidebar text widget (New and Old Reddit)
 * > (Planned) Updates community status/emoji
 * > (Planned) Community style
 * > (Planned) Other automation, like mega-thread creation for after storm discussions
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { ScheduledJobEvent, JSONObject, JobContext } from "@devvit/public-api";
import {JobBase} from "./JobBase.js";
import {AppSettings} from '../AppSettings.js';

export class DataUpdater extends JobBase {

    private static _Instance: DataUpdater | null = null;

    public static get Instance() {
        return DataUpdater._Instance;
    }

    private static readonly JOB_NAME = 'data-update';
    private static readonly REDIS_KEY = 'summary:job:id';

    public constructor() {
        super(DataUpdater.JOB_NAME, DataUpdater.REDIS_KEY);
        DataUpdater._Instance = this;
    }

    public override async cronExpression(context: JobContext): Promise<string> {
        const freq = await AppSettings.GetUpdateFrequency(context.settings);
        return `${freq === 1 ? '*' : (freq % 60 > 0 ? '*/' + freq : `0`)} * * * *`;
    }

    public override onRun(_: ScheduledJobEvent<JSONObject | undefined>, context: JobContext): Promise<void> {
        throw new Error("Method not implemented.");
    }
}