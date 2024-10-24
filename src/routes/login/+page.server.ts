import type { Actions } from "@sveltejs/kit";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { readUsersData } from "$lib/database/database";

export const actions = {
  default: async ({ cookies, request }) => {
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
    console.log(userAuthenticated);
  },
} satisfies Actions;

//const passwordHash = await bcrypt.hash(password, Number(PRIVATE_SALT_ROUNDS))
//const isa = await bcrypt.compare(password_plaintext, hash)
