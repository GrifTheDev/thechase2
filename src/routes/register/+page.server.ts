import { redirect, type Actions, error } from "@sveltejs/kit";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { updateUsersData } from "$lib/database/database";
import jwt from "jsonwebtoken"
import { PRIVATE_JWT_SECRET, PRIVATE_SALT_ROUNDS } from "$env/static/private";
import type { AuthCookieType } from "$lib/types/misc/auth_cookie";
import type { PageServerLoad } from "./$types";
import type { DBUsersType } from "$lib/types/database/users";
import { generateNewUserToken } from "$lib/server/auth";

export const load: PageServerLoad = async ({locals}) => {
    if (locals.user != undefined) throw redirect(303, "/")
}; 

// TODO: Add region suspicion thing

export const actions = {
  default: async ({ cookies, request }) => {
    // !! USE CRYPTO INSTEAD OF MATH.RANDOM() FOR GEN: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript (third or sum response)
    // !! ADD USER ALREADY EXISTS AND OTHER CHECKS (in login as well)!!!
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    let password: string = data.get("password")?.toString() || "";
    const name: string = data.get("name")?.toString() || "";
    const surname: string = data.get("surname")?.toString() || "";

    if (email == "" || password == "" || name == "" || surname == "")
      return { code: 400, message: "Please fill out all fields." };

    const emailHash = createHash("sha256").update(email).digest("hex");
    const passwordHash = await bcrypt.hash(password, Number(PRIVATE_SALT_ROUNDS))
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
    //const dbData = await readUsersData(emailHash);

    
  },
} satisfies Actions;


// 1729802535968
//const passwordHash = await bcrypt.hash(password, Number(PRIVATE_SALT_ROUNDS))
//const isa = await bcrypt.compare(password_plaintext, hash)
