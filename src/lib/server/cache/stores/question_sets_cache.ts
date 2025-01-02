import { CacheManager } from "../CacheManager";

let QuestionSetCache = new CacheManager({
  peTTL: 3600,
  maxEntries: 100000,
  cacheValidationTime: 600,
});

export { QuestionSetCache };
