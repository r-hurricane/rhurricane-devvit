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

    static #Instance: JobController | null = null;

    public static RegisterJobs(): void {
        JobController.Instance;
    }

    public static get Instance(): JobController {
        if (!JobController.#Instance)
            JobController.#Instance = new JobController();
        return JobController.#Instance;
    }

    static #JobList: JobBase[] = [];

    public constructor() {
        JobController.#JobList = [
            DataUpdater.Instance
        ];
    }

    public get jobList(): JobBase[] {
        return [...Object.values(JobController.#JobList)];
    }

}