/*!
* A process that updates the latest API data.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {Logger} from "../../util/Logger";
import {context, scheduler} from "@devvit/web/server";
import {AppSettings, SettingsEnvironment} from "../../util/AppSettings";
import {SummaryApiSchema} from "../redis/schemas/summary-api/SummaryApiSchema";
import * as trackerRedis from "../redis/trackerRedis";
import {allowRepost, createSummaryPost, repostIfAtRepostFreq} from "../../util/summaryPostUtils";
import {sendNotification} from "../../util/notificationUtils";

export const DataUpdaterJobName = "data-updater";

export const enableDataUpdate = async () => {
    // Determine if already scheduled
    const jobs = await scheduler.listJobs();
    const dataUpdate = jobs.find(d => d.name === DataUpdaterJobName);
    if (dataUpdate)
        return;

    // If not found in scheduler list, schedule
    const freq = await AppSettings.GetUpdateFrequency();
    const jobId = await scheduler.runJob({
        name: DataUpdaterJobName,
        cron: `${freq === 1 ? '*' : (freq % 60 > 0 ? '*/' + freq : `0`)} * * * *`
    });
    await trackerRedis.enableDataUpdaterJob(jobId);
};

export const disableDataUpdate = async () => {
    // Determine if already scheduled
    const jobs = await scheduler.listJobs();
    const dataUpdate = jobs.find(d => d.name === DataUpdaterJobName);
    if (!dataUpdate)
        return;

    // If found in scheduler list, disable
    await scheduler.cancelJob(dataUpdate.id);
    await trackerRedis.disableDataUpdaterJob();
};

export const executeDataUpdate = async (logger: Logger) => {
    // Start logger trace
    logger.traceStart('Execute Data Update');

    try {
        // Get the environment setting to know whether to use the dev domain or not
        const environment = await AppSettings.GetEnvironment();
        logger.debug('Environment:', environment);
        const summaryApiUrl = `https://${environment === SettingsEnvironment.Development ? 'dev.' : ''}rhurricane.net/api/v1/`;
        logger.debug('SummaryApiUrl:', summaryApiUrl);

        // Get if reposting is enabled
        const allowReposts = await allowRepost(logger);

        // Get the last modified date from Redis
        const lastModified = await trackerRedis.getSummaryApiLastModified();
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
            const staleSetting = await AppSettings.GetStaleHours();
            const saleTime = new Date().getTime() - staleSetting * 3600000;
            if (lastModified && new Date(lastModified).getTime() < saleTime) {
                logger.warn(`Stale data detected! Last update was ${lastModified} which was over ${staleSetting} hours ago!`);
                await sendNotification(`# r/${context.subredditName} HurricaneTracker Alerts\n\n## Data Updater - Stale Data Detected\n\nTime: ${new Date().toISOString()}\n\nThe data updater has detected the Summary API has become stale. Last update was ${lastModified} which was over ${staleSetting} hours ago!`);
                return;
            }

            // If allowing reposts, also check if we should repost based on time
            if (allowReposts)
                await repostIfAtRepostFreq(logger);
            return;
        }

        // If not a 200 status
        if (apiResult.status !== 200) {
            const message = `Received http ${apiResult.status} ${apiResult.statusText} response from the summary API!\n\n${await apiResult.text()}`;
            logger.error(message);
            await sendNotification(`# r/${context.subredditName} HurricaneTracker Alerts\n\n## Data Updater - API Call Failed\n\nTime: ${new Date().toISOString()}\n\n${message}`);
            return;
        }

        // If repost automation is enabled, we need to fetch the "old" data to know if there is a "significant" change
        const lastSummaryApiData = allowReposts && lastModified ? await trackerRedis.getSummaryApiData() : null;
        logger.debug(lastSummaryApiData ? 'Received previous summary API data' : 'Repost disabled, or no previous summary API data to compare');

        // Save the API result to Redis for the summary post!
        const apiData = await apiResult.json();
        const newSummaryApiData = await SummaryApiSchema.parseAsync(apiData);
        await trackerRedis.saveSummaryApiData(apiData, false);
        logger.info('Saved new API data to Redis!');

        // Write back the last-modified date (from API call) to Redis once all actions are successful
        const apiLastModified = apiResult.headers.get('Last-Modified');
        if (apiLastModified) {
            await trackerRedis.saveSummaryApiLastModified(apiLastModified);
            logger.info(`Saved last modified date ${apiLastModified} from API!`);

        } else {
            logger.warn(`API did not return a last modified date!`);
        }

        // If allow reposting is OFF, complete update task
        if (!allowReposts) {
            logger.debug('Repost ability is disabled');
            return;
        }

        // Note: if at repost frequency, but no new "major" developments made, it will repost on next run
        // (assuming no changes to API data gives a 304 status). See reference to repostIfAtRepostFreq above.

        // If there is not a previous post to compare with, skip
        if (!lastSummaryApiData) {
            logger.info('No data to compare with. Check will happen on next update.');
            return;
        }

        // If there is a new storm designation (i.e. new Tropical Depression/Storm or Hurricane)
        const hasNewStorm = newSummaryApiData.currentStorms.count > lastSummaryApiData.currentStorms.count;
        if (hasNewStorm) {
            // Find storm that is new
            const newStorm = newSummaryApiData.currentStorms.data
                .find(a => !lastSummaryApiData.currentStorms.data
                    .find(b => a.id == b.id));

            const basinId = newStorm?.binNumber.substring(0, 2);
            const basin = basinId == 'CP'
                ? 'Central Pacific'
                : (
                    basinId == 'EP'
                        ? 'Eastern Pacific'
                        : 'Atlantic'
                );

            logger.info('New API result has a current storm. Reposting!');
            const result = await createSummaryPost(
                `${newStorm?.name} Officially Forms in the ${basin}`,
                'New Storm',
                `New Storm - ${basin}`
            );
            logger.info('Created new post:', result);
            return;
        }

        // Ir there is a new TWO disturbance area, repost with New Disturbance info
        const hasNewDisturbance = newSummaryApiData.two.count > lastSummaryApiData.two.count;
        if (hasNewDisturbance)
        {
            // Find whether the new disturbance is in ALT or PAC
            const newAlt = newSummaryApiData.two.data.basins.atlantic.areas
                .find(a => !lastSummaryApiData.two.data.basins.atlantic.areas
                    .find(b => a.id == b.id));
            const newPac = newSummaryApiData.two.data.basins.pacific.areas
                .find(a => !lastSummaryApiData.two.data.basins.pacific.areas
                    .find(b => a.id == b.id));
            const newBasin = newAlt ? 'Atlantic' : 'Pacific';
            const newDist = newAlt ?? newPac;

            logger.info('New API result has a new disturbance in the TWO. Reposting!');
            const result = await createSummaryPost(
                `New Tropical Disturbance - ${newBasin} - ${newDist?.twoDay?.chance ?? '00'}% / ${newDist?.sevenDay?.chance ?? '00'}% - ${newDist?.title}`,
                'New Disturbance',
                `New Disturbance - ${newBasin}`
            );
            logger.info('Created new post:', result);
            return;
        }

        // Repost if there is a new storm being tracked by the ATCF
        const hasNewAtcfStorm = newSummaryApiData.atcf.count > lastSummaryApiData.atcf.count;
        if (hasNewAtcfStorm)
        {
            // Find storm that is new
            const newAtcfStorm = newSummaryApiData.atcf.data
                .find(a => !lastSummaryApiData.atcf.data
                    .find(b => a?.data?.[0]?.basin === b?.data?.[0]?.basin && a.genNo == b.genNo));

            logger.info('New API result has a new storm in the ATCF. Reposting!');
            const result = await createSummaryPost(
                newAtcfStorm?.data?.[0]
                    ? `New ATCF Storm - ${newAtcfStorm.data[0].basin}${newAtcfStorm.data[0].stormNo}`
                    : 'New ATCF Storm',
                'New ATCF Storm',
                newAtcfStorm?.data?.[0] ? `New ATCF Storm - ${newAtcfStorm.data[0].basin}` : 'New ATCF Storm'
            );
            logger.info('Created new post:', result);
            return;
        }

    } catch (e) {
        logger.error('Error during update process:', e);

        try {
            const sentNotification = await sendNotification(`# r/${context.subredditName} HurricaneTracker Alerts\n\n## Data Updater - General Failure\n\nTime: ${new Date().toISOString()}\n\nAn error was encountered while processing data updates:\n\`\`\`\n${e}\n\`\`\``);
            if (!sentNotification)
                logger.warn('No Discord notification was sent.');

        } catch (e2) {
            logger.error('Error while trying to send notification! ', e2);
        }

        throw e;

    } finally {
        logger.traceEnd();
    }
};