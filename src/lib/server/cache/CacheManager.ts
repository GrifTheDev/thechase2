/*
 * I wanted to use redis to create a quick in-memory cache.
 * However, I was already a bit sceptical about that idea since I had heard about the
 * license drama. I tried to google for redis, than some example on how to use it
 * then their docs and so on... Once I finally found some docs they wanted me to create
 * an account with their cloud service???
 * After all that, I decided it would be easier to implement my own cache in the form of
 * this here (for now) very lonely object. Whilst it won't be the most optimized solution,
 * implementing the basics of a cache should allow me to have a usable faximily thereof.
 */

import { PRIVATE_DEFAULT_CACHE_VALIDATION_TIME } from "$env/static/private";

/*
 * Parts of cache to consider (thanks to: https://www.honeybadger.io/blog/nodejs-caching/):
 * - Cache Eviction Policy (when the cache fills up which items to remove)
 * - Cache Strategy
 * - Cache expiration (when items expire)
 *
 */

/* class CacheManager {
    peTTL: number;
    test: number;
    
    constructor({peTTL}: { peTTL: number }) {
        this.peTTL = peTTL
        this.test = 0
    }

    public getTestState() {
        this.test += 1
        console.log("[CACHE MANAGER]::", this.test)
    }
} */

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
    this.maxCacheSize = settings!.maxEntries ?? -1; // * [MDN] returns its right-hand side operand when its left-hand side operand is null or undefined

    this.cacheData = {};

    setInterval(() => {
      this.checkCacheEntries();
    }, 2000);
  }

  public set(key: string | number, value: any) {

    if (this.cacheExceededMaxSize() != false) {
      console.log("Cache exceeded max size, cannot set new elements")
      return
    }

    const itemLifetime = Date.now() + (this.peTTL)
    this.cacheData[key] = {data: value, TTL: itemLifetime}
    //console.log(`[CACHE DBG] :: Added item ${value} with a lifetime of ${itemLifetime}.`)
    return
  }

  public get(key: string | number) {
    return this.checkCacheEntry(key)
  }

  private cacheExceededMaxSize() {
    const currentCacheKeys = Object.keys(this.cacheData)
    if (currentCacheKeys.length >= this.maxCacheSize) {
      return currentCacheKeys
    } else {
      return false
    }
  }

  private checkCacheEntries() {
    const checkCacheSize = this.cacheExceededMaxSize()
    if (checkCacheSize != false) {
      for (let key in checkCacheSize) {
        this.checkCacheEntry(key)
      }
    }
  }

  private checkCacheEntry(key: string | number) {
    const dataPKG = this.cacheData[key]
    if (dataPKG == undefined) return undefined

    console.log(Date.now() , dataPKG.TTL,Date.now() > dataPKG.TTL)
    if (Date.now() > dataPKG.TTL) {
      delete this.cacheData[key]
      return undefined
    } else {
      return dataPKG
    }
  }
}

export { CacheManager };
