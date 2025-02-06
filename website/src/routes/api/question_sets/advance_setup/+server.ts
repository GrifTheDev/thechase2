import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import jwt from "jsonwebtoken";
import { PRIVATE_JWT_ACCESS_TOKEN_SECRET } from "$env/static/private";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import { updateQuestionSetsData } from "$lib/database/database";
import { QuestionSetCache } from "$lib/server/cache/stores/question_sets_cache";
import { logger } from "$lib/server/logger/logger";

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const { id, newProgress }: { id: string; newProgress: number } =
    await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
  };

  const authToken = cookies.get("AccessToken");
  if (authToken == undefined)
    return Response.json({ code: 403, message: "No token detected in request." });

  const authTokenData = jwt.verify(
    authToken,
    PRIVATE_JWT_ACCESS_TOKEN_SECRET
  ) as AccessTokenPayloadType;
  const questionSets = authTokenData.permissions.question_sets;

  if (questionSets?.access != "readwrite" || !questionSets.docs.includes(id)) {
    responseObject.code = 403;
    responseObject.message =
      "You do not have sufficient permissions to change this document.";
    return Response.json(responseObject);
  }

  await updateQuestionSetsData(id, {progress: newProgress})
  QuestionSetCache.delete(id)

  logger.log({
    level: "info",
    service: "API",
    metadata: url.pathname,
    message: `Question set (${id}) creation progress advanced: ${newProgress - 1} -> ${newProgress}`,
  });

  return Response.json(responseObject);
};
