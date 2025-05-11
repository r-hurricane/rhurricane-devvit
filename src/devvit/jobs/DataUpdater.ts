/*!
 * The DataUpdater job will periodically check the rhurricane.net APIs for changes in hurricane data. If there are data
 * updates, it then:
 * > Saves required data in Redis for faster access/rendering in
 *   - Summary Post
 *   - Storm Post (future)
 *   - Recon Post (future)
 * > (Planned) Updates the community sidebar text widget (New and Old Reddit)
 * > (Planned) Updates community status/emoji once Reddit has APIs to do so ;) (WINK WINK TO YOU REDDIT ADMIN REVIEWING)
 * > (Planned) Community style changes
 * > (Planned) Other automation, like mega-thread creation for after storm discussions + detection of posts
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {JobContext, JSONObject, ScheduledJobEvent} from "@devvit/public-api";
import {JobBase} from "./JobBase.js";
import {AppSettings, SettingsEnvironment} from '../AppSettings.js';
import {Notifier} from "../notifications/Notifier.js";
import {RedisService} from "../redis/RedisService.js";
import {Logger} from "../Logger.js";
import {SummaryApiSchema} from "../redis/schemas/summary-api/SummaryApiSchema.js";
import {allowRepost, createSummaryPost, repostIfAtRepostFreq} from "../utils/summaryPostUtils.js";

export class DataUpdater extends JobBase {

    static #Instance: DataUpdater | null = null;

    public static get Instance() {
        if (!DataUpdater.#Instance)
            DataUpdater.#Instance = new DataUpdater();
        return DataUpdater.#Instance;
    }

    private static readonly JOB_NAME = 'data-update';
    private static readonly REDIS_KEY = 'summary:job:id';

    public constructor() {
        super(DataUpdater.JOB_NAME, DataUpdater.REDIS_KEY);
    }

    public override async cronExpression(context: JobContext): Promise<string> {
        const freq = await AppSettings.GetUpdateFrequency(context.settings);
        return `${freq === 1 ? '*' : (freq % 60 > 0 ? '*/' + freq : `0`)} * * * *`;
    }

    public override async onRun(_: ScheduledJobEvent<JSONObject | undefined>, context: JobContext): Promise<void> {

        // Create log helper
        const logger = await Logger.Create('Data Updater', context.settings);
        logger.traceStart('OnRun');

        let notifier: Notifier | undefined;

        try {
            // Create notifier
            notifier = await Notifier.Create(context);
            logger.debug('Created notifier');

            // Get the environment setting to know whether to use the dev domain or not
            const environment = await AppSettings.GetEnvironment(context.settings);
            logger.debug('Environment:', environment);
            const summaryApiUrl = `https://${environment === SettingsEnvironment.Development ? 'dev.' : ''}rhurricane.net/api/v1/`;
            logger.debug('SummaryApiUrl:', summaryApiUrl);

            // Get if reposting is enabled
            const redis = new RedisService(context.redis);
            const allowReposts = await allowRepost(logger, context.settings, redis);

            // Get the last modified date from Redis
            const lastModified = await redis.getSummaryApiLastModified();
            logger.debug('Redis LastModified:', lastModified);

            // Call summary API
            logger.debug('Calling API');
            const apiResult = await fetch(summaryApiUrl, {
                headers: lastModified ? {
                    'If-Modified-Since': lastModified
                } : undefined
            });
            logger.debug('API return status: ', apiResult.status);

            // If response was 304, the data has not been modified since last check.
            if (apiResult.status === 304) {
                logger.info('API returned 304 status (no updates).');

                // Check last modified is < {setting} hours ago
                const staleSetting = await AppSettings.GetStaleHours(context.settings);
                const saleTime = new Date().getTime() - staleSetting * 3600000;
                if (lastModified && new Date(lastModified).getTime() < saleTime) {
                    logger.warn(`Stale data detected! Last update was ${lastModified} which was over ${staleSetting} hours ago!`);
                    await notifier.send(`# r/Hurricane Devvit Alerts\n\n## Data Updater - Stale Data Detected\n\nThe data updater has detected the Summary API has become stale. Last update was ${lastModified} which was over ${staleSetting} hours ago!`);
                    return;
                }

                // If allowing reposts, also check if we should repost based on time
                if (allowReposts)
                    await repostIfAtRepostFreq(logger, context);
                return;
            }

            // If not a 200 status
            if (apiResult.status !== 200) {
                const message = `Received http ${apiResult.status} ${apiResult.statusText} response from the summary API!\n\n${await apiResult.text()}`;
                logger.error(message);
                await notifier.send(`# r/Hurricane Devvit Alerts\n\n## Data Updater - API Call Failed\n\n${message}`);
                return;
            }

            // If repost automation is enabled, we need to fetch the "old" data to know if there is a "significant" change
            const lastSummaryApiData = allowReposts ? await redis.getSummaryApiData() : null;
            logger.debug(lastSummaryApiData ? 'Received previous summary API data' : 'Repost disabled, or no previous summary API data to compare');

            // Save the API result to Redis for the summary post!
            const apiData = await apiResult.json();
            const newSummaryApiData = await SummaryApiSchema.parseAsync(apiData);
            await redis.saveSummaryApiData(apiData, false);
            logger.info('Saved new API data to Redis!');

            // Write back the last-modified date (from API call) to Redis once all actions are successful
            const apiLastModified = apiResult.headers.get('Last-Modified');
            if (apiLastModified) {
                await redis.saveSummaryApiLastModified(apiLastModified);
                logger.info(`Saved last modified date ${apiLastModified} from API!`);

            } else {
                logger.warn(`API did not return a last modified date!`);
            }

            // If allow reposting is OFF, complete update task
            if (!allowReposts) {
                logger.debug('Repost ability is disabled');
                return;
            }

            // Repost if at frequency
            const didRepostAtFreq = await repostIfAtRepostFreq(logger, context);
            if (didRepostAtFreq) return;

            // If there is not a previous post to compare with, skip
            if (!lastSummaryApiData) {
                logger.info('No data to compare with. Check will happen on next update.');
                return;
            }

            // Determine if there are new counts in the TWO or ATCF
            if (newSummaryApiData.two.count > lastSummaryApiData.two.count ||
                newSummaryApiData.atcf.count > lastSummaryApiData.atcf.count
            )
            {
                logger.info('New API result has a new storm in the TWO or ATCF. Reposting!');
                // TODO: Add New Storm Flair
                const result = await createSummaryPost(context);
                logger.info('Reposted new post:', result.toast.text, result.post?.id);
                return;
            }

        } catch (e) {
            logger.error('Error during update process:', e);

            try {
                if (!notifier || !notifier.enabled) {
                    logger.warn('No Notifier was created, so no notification was sent.');
                    return;
                }

                await notifier.send(`# r/Hurricane Devvit Alerts\n\n## Data Updater - General Failure\n\nAn error was encountered while processing data updates:\n\`\`\`\n${e}\n\`\`\``);

            } catch (e2) {
                logger.error('Error while trying to send notification! ', e2);
            }
        }

        logger.traceEnd();
    }
}