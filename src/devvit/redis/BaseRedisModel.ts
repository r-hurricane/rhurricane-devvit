/*!
 * Represents a model object stored in Redis.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export abstract class BaseRedisModel {

    public abstract RedisKey(params: any): string;

}