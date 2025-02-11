import { CacheManager } from "../CacheManager";

let GamesCache = new CacheManager({
  peTTL: 1800,
  maxEntries: 100000,
  cacheValidationTime: 600,
});

export { GamesCache };
