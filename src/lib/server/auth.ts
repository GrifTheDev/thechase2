//? Not sure how yet, but will probably move all auth logic here.
//? After my mishap with classes, everything will be functions

import { PRIVATE_CONSTANT_HASH_SALT, PRIVATE_CONSTANT_HASH_SALT_ROUNDS } from "$env/static/private"
import crypto from "crypto"
import { promisify } from "util"
// ? Change token gen?
async function generateNewUserToken(): Promise<string> {
    let finalToken = ""
    const timestamp: string = new Date().getTime().toString()
    finalToken += Buffer.from(timestamp).toString("base64") + "::"
    let bytesToAdd = (64 - finalToken.length) / 2
    finalToken += crypto.randomBytes(bytesToAdd).toString("hex")
    return finalToken
}

// To protect against brute-force attacks, I am using a constant hidden salt to hash email addresses as keys.
async function createConstantSaltHash (data: string) {
    const pbkdf2Async = promisify(crypto.pbkdf2);
    const hash = (await pbkdf2Async(data, PRIVATE_CONSTANT_HASH_SALT, Number(PRIVATE_CONSTANT_HASH_SALT_ROUNDS), 12, "sha256")).toString("base64")
    return hash
}

export {generateNewUserToken, createConstantSaltHash}
