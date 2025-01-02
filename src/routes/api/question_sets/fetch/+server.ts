import { PRIVATE_JWT_ACCESS_TOKEN_SECRET } from "$env/static/private";
import { readQuestionSetsData } from "$lib/database/database";
import { CacheManager } from "$lib/server/cache/CacheManager";
import { QuestionSetCache } from "$lib/server/cache/stores/question_sets_cache";
import type { QuestionSetType } from "$lib/types/database/question_sets";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { RequestHandler } from "./$types";
import jwt from "jsonwebtoken"

export const GET: RequestHandler = async ({ request, locals, cookies }) => {
  const authToken = cookies.get("AccessToken")
  if (authToken == undefined) return Response.json({ code: 500, message: "Internal service error" });

  const authTokenData = jwt.verify(authToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayloadType
  const questionSetDocIDs = authTokenData.permissions.question_sets?.docs
  const resData: Array<QuestionSetType> = []

  /*
    * Note to self (2.1.2025):
    * The page takes extremely long to load when going to /app/dashboard (2+ seconds!),
    * and after thinking the problem might be the cache I ran a benchmark.
    * The cache takes around 5ms to complete its query, and 90ms when the item is not cached.
    * The firefox profiler says that most of that 2+ second time is due to "After DNS request".
    * Furthermore I tried to go to youtube and it is also taking a while to load.
    * Conclusion, the cache I spent two hours building did not fuck up the entire app.
  */
  for (let i = 0; i < questionSetDocIDs!.length; i++) { 
    const setId = questionSetDocIDs![i]
    const cacheHit = QuestionSetCache.get(setId)

    if (cacheHit == undefined) {
      const qSetData = await readQuestionSetsData(setId)
      QuestionSetCache.set(setId, qSetData)
      resData.push(Object.assign(qSetData!, {id: setId}))
    } else {
      resData.push(Object.assign(cacheHit, {id: setId}))
    }
  } 

  return Response.json({ code: 200, message: "Success", data: resData });
};
