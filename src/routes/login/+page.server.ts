import type { Actions } from "@sveltejs/kit";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { readUsersData } from "$lib/database/database";
import jwt from "jsonwebtoken"
import { PRIVATE_JWT_SECRET } from "$env/static/private";

export const actions = {
  default: async ({ cookies, request }) => {
    // !! TODO ADD A CHECK TO SEE IF A USER ALREADY HAS A SIGNED JWT WITH THEIR TOKEN IN THE COOKIES
    // !! USE CRYPTO INSTEAD OF MATH.RANDOM(): https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript (third or sum response)
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    let password: string = data.get("password")?.toString() || "";

    if (email == "" || password == "")
      return { code: 400, message: "Please fill out both fields." };

    const emailHash = createHash("sha256").update(email).digest("hex");

    const dbData = await readUsersData(emailHash);

    if (dbData?.password == undefined)
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
      const JWT = jwt.sign({token: token, name: dbData.name}, PRIVATE_JWT_SECRET, {expiresIn: "30d"})

      // !! set cookie
      console.log(JWT)
    } else {
      return { code: 400, message: "Invalid email/password." };
    }
  },
} satisfies Actions;

// 1729802535968
//const passwordHash = await bcrypt.hash(password, Number(PRIVATE_SALT_ROUNDS))
//const isa = await bcrypt.compare(password_plaintext, hash)
