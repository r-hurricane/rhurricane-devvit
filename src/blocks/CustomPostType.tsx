/*!
 * The entry point for all custom post types, which branches off depending on the post.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, Context, useAsync} from "@devvit/public-api";
import {RedisService} from "../devvit/redis/RedisService.js";
import {LoadingOrError} from "./LoadingOrError.js";
import {SummaryWidget} from "./summary-widget/SummaryWidget.js";

interface CustomPostTypeProps {
    postId: string;
    context: Context;
}

const CustomPostType = (props: CustomPostTypeProps) => {
    // Get post type from Redis
    // TODO: Should I aso fetch post specific data, such as the TWO, and return that instead?
    const {data, loading, error} = useAsync(
        async () => {
            const redis = new RedisService(props.context.redis);
            return await redis.getPostMetadata(props.postId);
        },
        {
            finally: (_, error) => {
                if (error)
                    console.error(error);
            }
        }
    );

    // If loading or there was an error, show loading screen
    if (loading || error || !data) {
        return <LoadingOrError error={!loading} />;
    }

    switch (data.type) {

        case 'summary':
            return <SummaryWidget context={props.context} />;

        default:
            return <LoadingOrError error={true} errorMessage={`Unknown post type ${data.type}`} />;
    }
};

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