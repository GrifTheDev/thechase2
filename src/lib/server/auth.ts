//? Not sure how yet, but will probably move all auth logic here.
//? After my mishap with classes, everything will be functions

import crypto from "crypto"

async function generateNewUserToken(): Promise<string> {
    let finalToken = ""
    const timestamp: string = new Date().getTime().toString()
    finalToken += Buffer.from(timestamp).toString("base64") + "::"
    let bytesToAdd = (64 - finalToken.length) / 2
    finalToken += crypto.randomBytes(bytesToAdd).toString("hex")
    return finalToken
}

export {generateNewUserToken}