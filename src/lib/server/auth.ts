//? Not sure how yet, but will probably move all auth logic here.
//? After my mishap with classes, everything will be functions

import { PRIVATE_CONSTANT_HASH_SALT, PRIVATE_CONSTANT_HASH_SALT_ROUNDS, PRIVATE_JWT_SECRET, PRIVATE_REFRESH_TOKEN_LIFETIME } from "$env/static/private"
import type { DBUsersType } from "$lib/types/database/users";
import crypto from "crypto"
import { promisify } from "util"
import jwt from "jsonwebtoken"
import type { AccessTokenType } from "$lib/types/tokens/access_token";
import type { RefreshTokenType } from "$lib/types/tokens/refresh_token";
import { updateUsersData } from "$lib/database/database";

// 28 character long refresh token
async function generateNewUserRefreshToken(): Promise<string> {
    return crypto.randomBytes(21).toString("base64")
}
// To protect against brute-force attacks, I am using a constant hidden salt to hash email addresses as keys.
/**
   * @description Use this whenever you want to hash something with `sha256`.
   */
async function createConstantSaltHash (data: string) {
    const pbkdf2Async = promisify(crypto.pbkdf2);

    // * We have to replace all the / because firestore no likey them
    const hash = ((await pbkdf2Async(data, PRIVATE_CONSTANT_HASH_SALT, Number(PRIVATE_CONSTANT_HASH_SALT_ROUNDS), 12, "sha256")).toString("base64")).replaceAll("/", "")
    return hash
}

async function prepareTokenPair(emailHash: string, dbData: DBUsersType) {
    let accessToken = dbData.access_token
    const refreshToken = await generateNewUserRefreshToken()
    const currentTime = new Date().getTime()
    let refreshTokenObject: RefreshTokenType = {token: refreshToken, expiry: currentTime + Number(PRIVATE_REFRESH_TOKEN_LIFETIME)}
    try {
        const access_token_data = jwt.verify(accessToken, PRIVATE_JWT_SECRET) 
    } catch (error: any) {
        //console.log(error)
        // * Stored token is somehow corrupted. Since the user HAS authenticated with their password,
        // * aka, we know the user is who they say they are, we can just gen and store a new token pair.
        if (error.toString().startsWith("JsonWebTokenError")) {
            const accessTokenPayload: AccessTokenType = {name: "Teo", perms: "question_sets.write"}
            accessToken = jwt.sign(accessTokenPayload, PRIVATE_JWT_SECRET, { expiresIn: "5m" })
            console.log(`[INFO] :: Detected JWT signature error. Created new token pair:\n (access_token, refresh_token) = (${accessToken}, ${JSON.stringify(refreshTokenObject)})`)
            await updateUsersData(emailHash, {
                access_token: accessToken,
                refresh_tokens: [...dbData.refresh_tokens, refreshTokenObject],
            })
            // ! return the token pair
        }
    }
}

export {generateNewUserRefreshToken, createConstantSaltHash, prepareTokenPair}
