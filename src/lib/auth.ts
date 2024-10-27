import { createHash } from "crypto";
import { readUsersData } from "./database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { PRIVATE_JWT_SECRET } from "$env/static/private";

import type { AuthenticationManagerConstructorInputType } from "./types/misc/authentication_manager";
import type { DBUsersType } from "./types/database/users";
import type { AuthCookieType } from "./types/misc/auth_cookie";



class AuthenticationManager {
    email: string;
    password: string;
    dbUsrData: DBUsersType | undefined

    constructor({email: email, password: password}: AuthenticationManagerConstructorInputType) {
        this.email = email
        this.password = password
    }

    async authenticateUser() {
        if (this.email == "" || this.password == "")
            return { code: 400, message: "Please fill out both fields." };
    
        const emailHash = createHash("sha256").update("email").digest("hex")
        const dbUsrData = await readUsersData(emailHash)

        // TODO: MAKE TS NOT BITCH ABOUT POSSIBLE UNDEFINED TYPES
        if (dbUsrData?.password == undefined || dbUsrData?.name == undefined || dbUsrData?.token == undefined)
            return { code: 400, message: "Invalid email/password." };

        const storedPasswordHash: string = dbUsrData.password;
        const userAuthenticated = await bcrypt.compare(
            this.password,
            storedPasswordHash
          );

          const token = dbUsrData.token
      const JWTData: AuthCookieType = {token: token, name: dbUsrData.name}
      const JWT = jwt.sign(JWTData, PRIVATE_JWT_SECRET, {expiresIn: "30d"})
      return JWT
    }




}

export {AuthenticationManager}