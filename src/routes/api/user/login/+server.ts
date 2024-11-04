import { readUsersData } from "$lib/database/database";
import { createConstantSaltHash, validateStoredUserTokens } from "$lib/server/auth";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import bcrypt from "bcrypt";

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  const { email, password } = await request.json();

  const emailHash = await createConstantSaltHash(email);
  const dbData = await readUsersData(emailHash);

  if (dbData == undefined)
    return json({ code: 400, message: "Invalid email/password." });

  const storedPasswordHash: string = dbData.password;
  const userAuthenticated = await bcrypt.compare(password, storedPasswordHash);

  if (userAuthenticated) {
    const tokenPair = await validateStoredUserTokens(emailHash, dbData)
    console.log(tokenPair)
  } else {
    return json({code: 401, message: "Invalid username/password."})
  }

  return json({ code: 200, message: `${email} ${password}` });
};
