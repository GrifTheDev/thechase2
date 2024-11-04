import { readUsersData } from "$lib/database/database";
import {
  createConstantSaltHash,
  validateStoredUserTokens,
} from "$lib/server/auth";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import bcrypt from "bcrypt";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  const emailHash = await createConstantSaltHash(email);
  const dbData = await readUsersData(emailHash);

  if (dbData == undefined)
    return json({ code: 400, message: "Invalid email/password." });

  const storedPasswordHash: string = dbData.password;
  const userAuthenticated = await bcrypt.compare(password, storedPasswordHash);

  if (userAuthenticated) {
    const tokenPair = await validateStoredUserTokens(emailHash, dbData);

    if (tokenPair == undefined)
      return json({
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
    // TODO, handle success client side
    return json({code: 200, message: "OK"})
  } else {
    return json({ code: 401, message: "Invalid username/password." });
  }
};
