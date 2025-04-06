/*!
 * Base class for scheduled or cron jobs. Provides methods for scheduling, canceling, and other helper methods.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {
    Devvit,
    JobContext,
    JSONObject, RedisClient,
    ScheduledCronJob,
    ScheduledJob,
    ScheduledJobEvent, Scheduler, TriggerContext
} from "@devvit/public-api";

export abstract class JobBase {

    protected jobName: string;
    protected redisKey: string;

    protected constructor(jobName: string, redisKey: string) {
        this.jobName = jobName;
        this.redisKey = redisKey;

        this.registerJob();
    }

    public abstract onRun(event: ScheduledJobEvent<JSONObject | undefined>, context: JobContext): Promise<void>;

    public registerJob(): void {
        Devvit.addSchedulerJob({
            name: this.jobName,
            onRun: async (event, context) => {
                try {
                    await this.onRun(event, context);
                } catch (ex) {
                    console.error(`Unhandled error running job ${this.jobName}`, ex);
                }
            }
        });
    }

    public async cronExpression(_: JobContext): Promise<string> {
        throw new Error('CronExpression not implemented.');
    }

    public async getRedisId(redis: RedisClient): Promise<string | undefined> {
        return await redis.get(this.redisKey);
    }

    public async isEnabled(redis: RedisClient): Promise<boolean> {
        return !!(await this.getRedisId(redis));
    }

    public async getScheduledJob(scheduler: Scheduler): Promise<ScheduledJob | ScheduledCronJob | undefined> {
        return (await scheduler.listJobs()).find(j => j.name === this.jobName);
    }

    public async scheduleCronJob(context: JobContext, reschedule: boolean = false, data: {} | undefined = undefined): Promise<boolean> {
        try {
            // Check the job list to determine if job is already scheduled
            const scheduledJob = await this.getScheduledJob(context.scheduler);
            if (scheduledJob) {

                // If not rescheduling, return
                if (!reschedule) {
                    console.log(`[JobBase.scheduleJob] Job ${this.jobName} already scheduled and was not asked to reschedule.`);
                    return true;
                }

                // Otherwise, cancel the currently scheduled job and reschedule
                console.log(`[JobBase.scheduleJob] Found job ${this.jobName} is currently scheduled. Canceling current job and rescheduling.`);
                await context.scheduler.cancelJob(scheduledJob.id);
            }

            // Schedule the job
            const jobId = await context.scheduler.runJob({
                cron: await this.cronExpression(context),
                name: this.jobName,
                data: data
            });

            // Store the job ID to redis
            await context.redis.set(this.redisKey, jobId);

            console.log(`[JobBase.scheduleJob] Successfully scheduled ${this.jobName} job.`);
            return true;

        } catch (ex) {
            console.error(`[JobBase.scheduleJob] Error while scheduling ${this.jobName} job: `, ex);
            throw ex;
        }
    }

    public async cancelJob(context: JobContext, disable: boolean = true): Promise<boolean> {
        try {
            // Get scheduled job
            const scheduledJob = await this.getScheduledJob(context.scheduler);
            if (!scheduledJob) {
                console.log(`[JobBase.cancelJob] Found job ${this.jobName} is not currently scheduled.`);
                return false;
            }

            // Cancel job
            await context.scheduler.cancelJob(scheduledJob.id);
            console.log(`[JobBase.cancelJob] Successfully canceled job ${this.jobName}`);

            // If asked to disable, also call disable
            return disable ? await this.disableJob(context.redis) : true;

        } catch(ex) {
            console.error(`[JobBase.cancelJob] Error while canceling job ${this.jobName}`, ex);
            throw ex;
        }
    }

    public async disableJob(redis: RedisClient): Promise<boolean> {
        try {
            await redis.del(this.redisKey);
            return true;

        } catch(ex) {
            console.error(`[JobBase.disable] Error while disabling job ${this.jobName}`, ex);
            throw ex;
        }
    }

    public async onAppUpdate(context: TriggerContext): Promise<void> {
        try {
            // Convert TriggerContext to JobContext
            const jobContext = context satisfies JobContext;

            // Save if job is enabled
            const isEnabled = await this.isEnabled(context.redis);
            console.log(`[JobBase.onAppUpdate] Found ${this.jobName} is ${isEnabled ? 'enabled. Canceling and rescheduling job.' : 'disabled. Canceling any scheduled instances.'}`)

            // Next, force cancel (and disable)
            await this.cancelJob(jobContext);

            // If enabled, reschedule!
            if (isEnabled)
                await this.scheduleCronJob(jobContext, true);

        } catch(ex) {
            console.error(`[JobBase.onAppUpdate] Error while running onAppUpdate for job ${this.jobName}.`, ex);
        }
    }

}