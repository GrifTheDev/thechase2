import { redirect, type Actions, error } from "@sveltejs/kit";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { readUsersData, updateUsersData } from "$lib/database/database";
import jwt from "jsonwebtoken"
import { PRIVATE_JWT_SECRET, PRIVATE_PASSWORD_SALT_ROUNDS } from "$env/static/private";
import type { AuthCookieType } from "$lib/types/misc/auth_cookie";
import type { PageServerLoad } from "./$types";
import type { DBUsersType } from "$lib/types/database/users";
import { createConstantSaltHash, generateNewUserToken } from "$lib/server/auth";

export const load: PageServerLoad = async ({locals}) => {
    if (locals.user != undefined) throw redirect(303, "/")
}; 

// TODO: Add region suspicion thing
export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    let password: string = data.get("password")?.toString() || "";
    const name: string = data.get("name")?.toString() || "";
    const surname: string = data.get("surname")?.toString() || "";

    if (email == "" || password == "" || name == "" || surname == "")
      return { code: 400, message: "Please fill out all fields." };

    // E-mail does not contain @something.com
    if (email.split("@").length < 2)
      return { code: 400, message: "Invalid e-mail." };
    // The part after @ in the email does not contain a .
    if (email.split("@")[1].split(".").length < 2)
      return { code: 400, message: "Invalid e-mail." };
    const emailHash = await createConstantSaltHash(email)
    console.log(emailHash)
    //TODO return { code: 409, message: "User already exists." }
    if (await readUsersData(emailHash) != undefined) return { code: 409, message: "User already exists." };
    const passwordHash = await bcrypt.hash(password, Number(PRIVATE_PASSWORD_SALT_ROUNDS))
    const token = await generateNewUserToken()
    const dataToInsert: DBUsersType = {
      email: email,
      password: passwordHash,
      name: name,
      surname: surname,
      token: token
    }

    // !!Look into this, its returning a shorter hash
    await updateUsersData(emailHash, dataToInsert)
    const JWTData: AuthCookieType = {name: name, token: token}
    const JWT = jwt.sign(JWTData, PRIVATE_JWT_SECRET, {expiresIn: "30d"})

    cookies.set("AuthorizationToken", `${JWT}`, {
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    throw redirect(303, "/")
  },
} satisfies Actions;
