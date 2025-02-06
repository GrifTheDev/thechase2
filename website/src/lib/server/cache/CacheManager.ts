/* 
  * Before writing this I felt overwhelmed at the idea of creating even this simple
  * in-memory cache. However, the sources listed below helped me a ton with understanding
  * what a cache is and how to write this type of cache.
  * 
  * Important sources:
  * 1. It is imporant to undestand the theory behind caches before being able to implement them.
  * For that I found this wonderful article: https://www.honeybadger.io/blog/nodejs-caching/
  * 
  * 2. Whilst I implemented this from scratch, the GitHub repository for "node-cache" helped
  * a lot with understanding what goes where. To be specific, the "node_cache.coffee"
  * file: https://github.com/node-cache/node-cache/blob/master/_src/lib/node_cache.coffee.
*/

import { PRIVATE_DEFAULT_CACHE_VALIDATION_TIME } from "$env/static/private";
import { logger } from "../logger/logger";

interface SettingsType {
  peTTL: number; // * per entry time-to-live (in seconds)
  cacheValidationTime?: number // * overall time to validate entire cache
  maxEntries?: number; // * max number of entries allowed in the cache, checked in
}

class CacheManager {
  cacheData: { [key: string]: {data: any, TTL: number} };

  peTTL: number;
  cacheValidationTime: number;
  maxCacheSize: number;

  constructor(settings: SettingsType) {
    this.peTTL = settings.peTTL * 1000; // * covert to ms
    this.cacheValidationTime = settings.cacheValidationTime ?? (Number(PRIVATE_DEFAULT_CACHE_VALIDATION_TIME) * 1000)
    this.maxCacheSize = settings!.maxEntries ?? 0; // * [MDN] returns its right-hand side operand when its left-hand side operand is null or undefined

    this.cacheData = {};

    setInterval(() => {
      this.checkCacheEntries();
    }, this.cacheValidationTime).unref();
  }

  public set(key: string | number, value: any) {

    if (this.cacheExceededMaxSize() != false) {
      logger.log({
        level: "error",
        service: "CACHE",
        metadata: "cacheSize",
        message: `Cache exceeded max size, cannot set new elements`,
      });
      return undefined
    }

    const itemLifetime = Date.now() + (this.peTTL)
    this.cacheData[key] = {data: value, TTL: itemLifetime}
    return
  }

  public get(key: string | number) {
    return this.checkCacheEntry(key)
  }

  public delete(key: string | number) {
    delete this.cacheData[key]
    return true
  }

  public getAll() {
    return this.cacheData
  }

  private cacheExceededMaxSize() {
    const currentCacheKeys = Object.keys(this.cacheData)
    if (currentCacheKeys.length >= this.maxCacheSize && this.maxCacheSize > 0) {
      return currentCacheKeys
    } else {
      return false
    }
  }

  private checkCacheEntries() {
    const checkCacheSize = this.cacheExceededMaxSize()
    // ? I don't see the point in going through the entire cache,
    // ? since we check each item when we get it. Only if we exceed
    // ? max size should we go through this.
    if (checkCacheSize != false) {
      for (let key in checkCacheSize) {
        this.checkCacheEntry(key)
      }
    }
  }

  private checkCacheEntry(key: string | number) {
    const dataPKG = this.cacheData[key]
    if (dataPKG == undefined) return undefined

    if (Date.now() > dataPKG.TTL) {
      delete this.cacheData[key]
      return undefined
    } else {
      return dataPKG.data
    }
  }
}

export { CacheManager };
