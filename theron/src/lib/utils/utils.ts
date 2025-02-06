import crypto from "crypto"

function generateRandomBase64String(lengthBytes: number): string {
    return crypto.randomBytes(lengthBytes).toString("base64");
}

export {generateRandomBase64String}