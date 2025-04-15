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
import {Logger} from "../Logger.js";

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
                    const logger = await Logger.Create('Job Base', context.settings);
                    logger.error(`Unhandled error registering job ${this.jobName}`, ex);
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

        // Create logger
        const logger = await Logger.Create('Job Base', context.settings);

        try {
            // Check the job list to determine if job is already scheduled
            const scheduledJob = await this.getScheduledJob(context.scheduler);
            if (scheduledJob) {

                // If not rescheduling, return
                if (!reschedule) {
                    logger.info(`ScheduleJob: Job ${this.jobName} already scheduled and was not asked to reschedule.`);
                    return true;
                }

                // Otherwise, cancel the currently scheduled job and reschedule
                logger.info(`ScheduleJob: Found job ${this.jobName} is currently scheduled. Canceling current job and rescheduling.`);
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

            logger.info(`ScheduleJob: Successfully scheduled ${this.jobName} job.`);
            return true;

        } catch (ex) {
            logger.error(`ScheduleJob: Error while scheduling ${this.jobName} job: `, ex);
            throw ex;
        }
    }

    public async cancelJob(context: JobContext, disable: boolean = true): Promise<boolean> {

        // Create logger
        const logger = await Logger.Create('Job Base', context.settings);

        try {
            // Get scheduled job
            const scheduledJob = await this.getScheduledJob(context.scheduler);
            if (!scheduledJob) {
                logger.info(`CancelJob: Found job ${this.jobName} is not currently scheduled.`);
                return false;
            }

            // Cancel job
            await context.scheduler.cancelJob(scheduledJob.id);
            logger.info(`CancelJob: Successfully canceled job ${this.jobName}`);

            // If asked to disable, also call disable
            return disable ? await this.disableJob(context.redis) : true;

        } catch(ex) {
            logger.error(`CancelJob: Error while canceling job ${this.jobName}`, ex);
            throw ex;
        }
    }

    public async disableJob(redis: RedisClient): Promise<boolean> {
        try {
            await redis.del(this.redisKey);
            return true;

        } catch(ex) {
            const logger = new Logger('Job Base');
            logger.error(`Disable: Error while disabling job ${this.jobName}`, ex);
            throw ex;
        }
    }

    public async onAppUpdate(context: TriggerContext): Promise<void> {

        // Create logger
        const logger = await Logger.Create('Job Base', context.settings);

        try {
            // Convert TriggerContext to JobContext
            const jobContext = context satisfies JobContext;

            // Save if job is enabled
            const isEnabled = await this.isEnabled(context.redis);
            logger.info(`OnAppUpdate: Found ${this.jobName} is ${isEnabled ? 'enabled. Canceling and rescheduling job.' : 'disabled. Canceling any scheduled instances.'}`)

            // Next, force cancel (and disable)
            await this.cancelJob(jobContext);

            // If enabled, reschedule!
            if (isEnabled)
                await this.scheduleCronJob(jobContext, true);

        } catch(ex) {
            logger.error(`OnAppUpdate: Error while running onAppUpdate for job ${this.jobName}.`, ex);
        }
    }

}