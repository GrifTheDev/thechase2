import { PRIVATE_JWT_ACCESS_TOKEN_SECRET } from "$env/static/private";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { RequestHandler } from "./$types";
import jwt from "jsonwebtoken"

export const GET: RequestHandler = async ({ request, locals, cookies }) => {
  const authToken = cookies.get("AccessToken")
  if (authToken == undefined) return Response.json({ code: 500, message: "Internal service error" });

  const authTokenData = jwt.verify(authToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayloadType
  const questionSetDocIDs = authTokenData.permissions.question_sets?.docs
    
  return Response.json({ code: 200, questionSetIDs: questionSetDocIDs });
};
