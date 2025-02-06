import { CacheManager } from "../CacheManager";

let ClientsCache = new CacheManager({
  peTTL: 3600,
  maxEntries: 100000,
  cacheValidationTime: 600,
});

export { ClientsCache };
