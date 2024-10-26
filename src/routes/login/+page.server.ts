import { redirect, type Actions } from "@sveltejs/kit";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { readUsersData } from "$lib/database/database";
import jwt from "jsonwebtoken"
import { PRIVATE_JWT_SECRET } from "$env/static/private";
import type { AuthCookieType } from "$lib/types/misc/auth_cookie";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals}) => {
    console.log(locals.user)
    if (locals.user != undefined) throw redirect(303, "/")
}; 

export const actions = {
  default: async ({ cookies, request }) => {
    // !! USE CRYPTO INSTEAD OF MATH.RANDOM() FOR GEN: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript (third or sum response)
    
    /* const authCookie = cookies.get("AuthorizationToken")
    if(authCookie != undefined && jwt.verify(authCookie, PRIVATE_JWT_SECRET)) return console.log("user already detected") */
    
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    let password: string = data.get("password")?.toString() || "";

    if (email == "" || password == "")
      return { code: 400, message: "Please fill out both fields." };

    const emailHash = createHash("sha256").update(email).digest("hex");

    const dbData = await readUsersData(emailHash);

    // TODO: MAKE TS NOT BITCH ABOUT POSSIBLE UNDEFINED TYPES
    if (dbData?.password == undefined || dbData?.name == undefined || dbData?.token == undefined)
      return { code: 400, message: "Invalid email/password." };

    const storedPasswordHash: string = dbData.password;
    const userAuthenticated = await bcrypt.compare(
      password,
      storedPasswordHash
    );
    // clear plain-text password just in case :)
    password = "";

    if (userAuthenticated) {
      const token = dbData.token
      const JWTData: AuthCookieType = {token: token, name: dbData.name}
      const JWT = jwt.sign(JWTData, PRIVATE_JWT_SECRET, {expiresIn: "30d"})

      cookies.set("AuthorizationToken", `${JWT}`, {
        secure: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      throw redirect(303, "/")
    } else {
      return { code: 400, message: "Invalid email/password." };
    }
  },
} satisfies Actions;


// 1729802535968
//const passwordHash = await bcrypt.hash(password, Number(PRIVATE_SALT_ROUNDS))
//const isa = await bcrypt.compare(password_plaintext, hash)
