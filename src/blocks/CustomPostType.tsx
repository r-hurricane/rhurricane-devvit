/*!
 * The entry point for all custom post types, which branches off depending on the post.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context, Devvit, useAsync} from "@devvit/public-api";
import {RedisService} from "../devvit/redis/RedisService.js";
import {LoadingOrError} from "./LoadingOrError.js";
import {SummaryWidget} from "./summary-widget/SummaryWidget.js";
import {AppSettings, MaintenanceLevel} from "../devvit/AppSettings.js";
import {PostMetadataDto} from "../../shared/dtos/redis/PostMetadataDto.js";

interface CustomPostTypeProps {
    postId: string;
    context: Context;
}

type CustomPostLoadData = {
    maintenanceMode: MaintenanceLevel,
    maintenanceMessage: string | null,
    postMetadata: PostMetadataDto | null
}

const CustomPostType = (props: CustomPostTypeProps) => {
    // Get post type from Redis
    // TODO: Should I fetch post specific data, such as the TWO, and return that instead? Prevents two useAsync calls.
    const {data, loading, error} = useAsync(
        async (): Promise<CustomPostLoadData> => {
            const maintenanceMode = await AppSettings.GetMaintenanceMode(props.context.settings);
            const maintenanceMessage = await AppSettings.GetMaintenanceModeMessage(props.context.settings);
            const postMetadata = maintenanceMode !== MaintenanceLevel.Hard
                ? await new RedisService(props.context.redis).getPostMetadata(props.postId)
                : null;
            return { maintenanceMode: maintenanceMode, maintenanceMessage: maintenanceMessage, postMetadata: postMetadata};
        },
        {
            finally: (_, error) => {
                if (error)
                    console.error('[RHurricane Post Loader] - Error loading post metadata:', error);
            }
        }
    );

    // If loading or there was an error, show loading screen
    if (loading || error || !data || !data.postMetadata || data.maintenanceMode === MaintenanceLevel.Hard) {
        return <LoadingOrError
            error={!loading}
            errorMessage={
                error && error.message.indexOf('redis currently manually disabled') > -1
                    ? 'Sorry, Reddit is performing app maintenance. Check back soon!'
                    : data?.maintenanceMode === MaintenanceLevel.Hard
                        ? data.maintenanceMessage !== null ? data.maintenanceMessage : 'Sorry, tracking app is under maintenance. Check back soon!'
                        : undefined
            }
        />;
    }

    switch (data.postMetadata.type) {

        case 'summary':
            return <SummaryWidget context={props.context} />;

        default:
            return <LoadingOrError error={true} errorMessage={`Unknown post type ${data.postMetadata.type}`} />;
    }
};

// Registers the custom post type with Devvit
export const registerCustomPostType = () => {
    // Add the custom post type to Devvit
    Devvit.addCustomPostType({
        name: 'R-Hurricane Interactive',
        height: 'tall',
        render: (context) => {
            return context.postId
                ? <CustomPostType postId={context.postId} context={context} />
                : <LoadingOrError error={true} />;
        }
    });
};