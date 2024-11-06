import { redirect, type Actions } from "@sveltejs/kit";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { readUsersData } from "$lib/database/database";
import jwt from "jsonwebtoken"
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, url}) => {
    //console.log(locals.user)
    if (locals.user != undefined) throw redirect(303, "/app/dashboard")
}; 

// TODO: Add region suspicion thing
export const actions = {
  default: async ({ cookies, request, fetch }) => {
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    let password: string = data.get("password")?.toString() || "";

    if (email == "" || password == "")
      return { code: 400, message: "Please fill out both fields." };

    // E-mail does not contain @something.com
    if (email.split("@").length < 2)
      return { code: 400, message: "Invalid e-mail." };
    // The part after @ in the email does not contain a .
    if (email.split("@")[1].split(".").length < 2)
      return { code: 400, message: "Invalid e-mail." };

    const res = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({email: email, password: password})
    })
    console.log((await res.json()))
    return
    /*     
    const emailHash = await createConstantSaltHash(email)

    const dbData = await readUsersData(emailHash);

    // TODO: MAKE TS NOT BITCH ABOUT POSSIBLE UNDEFINED TYPES
    if (dbData?.password == undefined || dbData?.name == undefined || dbData?.access_token == undefined)
      return { code: 400, message: "Invalid email/password." };

    const storedPasswordHash: string = dbData.password;
    const userAuthenticated = await bcrypt.compare(
      password,
      storedPasswordHash
    );
    // clear plain-text password just in case :)
    password = "";

    if (userAuthenticated) {
      const token = dbData.access_token
      const JWTData: AuthCookieType = {token: token, name: dbData.name}
      const JWT = jwt.sign(JWTData, PRIVATE_JWT_SECRET, {expiresIn: "30d"})

      cookies.set("AuthorizationToken", `${JWT}`, {
        secure: true,
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      throw redirect(303, "/app/dashboard")
    } else {
      return { code: 400, message: "Invalid email/password." };
    } */
  },
} satisfies Actions;

