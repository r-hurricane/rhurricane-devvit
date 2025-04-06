/*!
 * The JobController creates an entry point to register scheduled jobs into Devvit and perform actions on them, such as
 * schedule and cancel them.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {DataUpdater} from "./DataUpdater.js";
import {JobBase} from "./JobBase.js";

export class JobController {

    private static _Instance: JobController | null = null;

    public static Init(): JobController {
        if (!JobController._Instance)
            JobController._Instance = new JobController();
        return JobController._Instance;
    }

    public static get Instance(): JobController {
        return JobController.Init();
    }

    private static _JobList: JobBase[] = [];

    public constructor() {
        JobController._JobList = [
            new DataUpdater()
        ];
    }

    public get jobList(): JobBase[] {
        return [...Object.values(JobController._JobList)];
    }

}