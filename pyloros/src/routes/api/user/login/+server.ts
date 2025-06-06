import { readUsersData } from "$lib/database/database";
import {
  validateStoredUserTokens,
} from "$lib/server/auth/auth";
import { createConstantSaltHash } from "$lib/server/auth/utilities";
import type { RequestHandler } from "./$types";
import bcrypt from "bcrypt";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  if (email == undefined || password == undefined) return Response.json({ code: 400, message: "Bad request" });
  const emailHash = await createConstantSaltHash(email);
  const dbData = await readUsersData(emailHash);

  if (dbData == undefined)
    return Response.json({ code: 400, message: "Invalid email/password." });

  const storedPasswordHash: string = dbData.password;
  const userAuthenticated = await bcrypt.compare(password, storedPasswordHash);

  if (userAuthenticated) {
    const tokenPair = await validateStoredUserTokens(emailHash, dbData);

    if (tokenPair == undefined)
      return Response.json({
        code: 500,
        message: "An unexpected internal error happened. Sorry!",
      });

    // * Both these cookies do not have maxAges so that we can check them in middleware.
    cookies.set("AccessToken", tokenPair.accessToken, {
      secure: true,
      path: "/",
      sameSite: "strict",
    });
    cookies.set("RefreshToken", tokenPair.refreshToken, {
      secure: true,
      path: "/",
      sameSite: "strict",
    });
    return Response.json({code: 200, message: "OK"})
  } else {
    return Response.json({ code: 401, message: "Invalid username/password." });
  }
};
