/*!
 * Represents a schema for storing data in Redis.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

export type RedisKeyParam = number | string;

export abstract class BaseRedisSchema {

    public abstract redisKey(...params: RedisKeyParam[]): string;

}