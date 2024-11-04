//? Not sure how yet, but will probably move all auth logic here.
//? After my mishap with classes, everything will be functions

import { PRIVATE_ACCESS_TOKEN_LIFETIME, PRIVATE_CONSTANT_HASH_SALT, PRIVATE_CONSTANT_HASH_SALT_ROUNDS, PRIVATE_JWT_SECRET, PRIVATE_REFRESH_TOKEN_LIFETIME } from "$env/static/private"
import type { DBUsersType } from "$lib/types/database/users";
import crypto from "crypto"
import { promisify } from "util"
import jwt from "jsonwebtoken"
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { RefreshTokenPayloadType } from "$lib/types/tokens/refresh_token";
import { updateUsersData } from "$lib/database/database";

// 28 character long refresh token
async function generateNewUserRefreshToken(): Promise<string> {
    return crypto.randomBytes(21).toString("base64")
}

function generateRandomBase64String(lengthBytes: number): string {
    return crypto.randomBytes(lengthBytes).toString("base64")
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
/**
   * @description Function responsible for validating ONLY STORED access and refresh tokens. Called only on LOGIN.
   */ 
async function validateStoredUserTokens(emailHash: string, dbData: DBUsersType): Promise<{accessToken: string, refreshToken: string} | undefined>  {
    let accessToken = dbData.access_token
    const refreshToken = jwt.sign({salt: generateRandomBase64String(64)}, PRIVATE_JWT_SECRET, { expiresIn: PRIVATE_REFRESH_TOKEN_LIFETIME })

    try {
        jwt.verify(accessToken, PRIVATE_JWT_SECRET)
        await updateUsersData(emailHash, {
            refresh_tokens: [...dbData.refresh_tokens, refreshToken],
        })
        return {accessToken: accessToken, refreshToken: refreshToken}
    } catch (error: any) {
        // ! There exist two cases in which we can generate a new token pair, without being provided a refresh token: 
        // ! Case 1 [error.toString().startsWith("JsonWebTokenError")]
        // * Stored token is somehow corrupted. Since the user HAS authenticated with their password,
        // * aka, we know the user is who they say they are, we can just gen and store a new token pair.

        // ! Case 2 [error.toString().startsWith("TokenExpiredError")]
        // * We are trying to give the user an expired token so we need to renew it. We do not have an access token, since this is the user logging in.
        // * This is then, the one condition under which we will generate a new access token without a refresh token and return both.
        if (error.toString().startsWith("JsonWebTokenError") || error.toString().startsWith("TokenExpiredError")) {
            const accessTokenPayload: AccessTokenPayloadType = {name: "Teo", permissions: dbData.permissions, salt: generateRandomBase64String(16)}
            accessToken = jwt.sign(accessTokenPayload, PRIVATE_JWT_SECRET, { expiresIn: PRIVATE_ACCESS_TOKEN_LIFETIME })
            console.log(`[INFO] [user_auth 1] [${error.toString().split(':')[0]}]:: Detected JWT error on stored access_token. Created new token pair:\n (access_token, refresh_token) = (${accessToken}, ${refreshToken})`)
            await updateUsersData(emailHash, {
                access_token: accessToken,
                refresh_tokens: [...dbData.refresh_tokens, refreshToken],
            })
            return {accessToken: accessToken, refreshToken: refreshToken}
        } else {
            console.log(error)
        }
        
    }
}

// !IMplement
async function renewAccessToken(accessToken: AccessTokenPayloadType, refershToken: RefreshTokenPayloadType, dbData: DBUsersType | undefined) {

}

export {generateNewUserRefreshToken, createConstantSaltHash, validateStoredUserTokens}
