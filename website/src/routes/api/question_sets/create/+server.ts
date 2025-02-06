import type { QuestionSetType } from "$lib/types/database/question_sets";
import type { RequestHandler } from "./$types";

import { PRIVATE_JWT_ACCESS_TOKEN_SECRET } from "$env/static/private";
import jwt from 'jsonwebtoken';
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import { updateQuestionSetsData } from "$lib/database/database";
import { generateRandomBase64String } from "$lib/server/auth/utilities";
import { updateUserPermissions } from "$lib/server/auth/permissions";

// * For future reference:
// * Since middleware handles authentication check and runs on every request
// * to routes starting with "/app" and "/api" we know at this point that
// * the user authenticated has a valid token pair from which we can pull data.
// * Even if someone queries the API with some bullshit token, the middleware will
// * activate and reroute the user to /login.
export const POST: RequestHandler = async ({ request, cookies }) => {
  const { title, progress, questions_open, questions_three }: QuestionSetType = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success"
  }

  const authToken = cookies.get("AccessToken")
  const refreshToken = cookies.get("RefreshToken")
  if (authToken == undefined) return Response.json({ code: 500, message: "Internal service error" });
  if (refreshToken == undefined) return Response.json({ code: 500, message: "Internal service error" })

  // * Once again, this here verification is to GET the data encoded in the token.
  // * This step here is not used to VERIFY the token, that job was done in middleware.
  const authTokenData = jwt.verify(authToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET) as AccessTokenPayloadType
  if (authTokenData.permissions.question_sets?.access != "readwrite") {
    responseObject = {code: 403, message: "You do not have the permissions requried to create question sets."}
    return Response.json(responseObject)
  }

  // * You have the permission to create a question set! YAY!
  let questionSetID = generateRandomBase64String(24)
  questionSetID = questionSetID.replaceAll("/", "") // *Just in case the random gen gives us a /.
  await updateQuestionSetsData(questionSetID, {
    title: title,
    progress: progress,
    questions_open: questions_open,
    questions_three: questions_three
  })

  // * Since permission data is embeded in the access_token we need to update it as well.
  const newTokenPair = await updateUserPermissions("question_sets", questionSetID, "readwrite", {accessToken: authToken, refreshToken: refreshToken})

  cookies.set("AccessToken", newTokenPair.accessToken, {
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  cookies.set("RefreshToken", newTokenPair.refreshToken, {
    secure: true,
    path: "/",
    sameSite: "strict",
  });

  return Response.json(Object.assign(responseObject, {id: questionSetID}));

};
