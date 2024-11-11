import { PRIVATE_PASSWORD_SALT_ROUNDS } from "$env/static/private";
import { readUsersData } from "$lib/database/database";
import { createConstantSaltHash, userDBInit } from "$lib/server/auth/utilities";
import type { RequestHandler } from "./$types";
import bcrypt from "bcrypt";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { name, surname, email, password } = await request.json();

  const emailHash = await createConstantSaltHash(email);
  const dbData = await readUsersData(emailHash);
  
  if (dbData != undefined)
    return Response.json({ code: 409, message: "User already exists." });

  const passwordHash = await bcrypt.hash(password, Number(PRIVATE_PASSWORD_SALT_ROUNDS))
  const tokenPair = await userDBInit(emailHash, {name: name, surname: surname, email: email, password: passwordHash})

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
  return Response.json({code: 201, message: "OK"})

};
