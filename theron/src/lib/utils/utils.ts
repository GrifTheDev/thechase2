import crypto from "crypto"
import { readGamesData } from "../database/database";
import { logger } from "../logger";

function generateRandomBase64String(lengthBytes: number): string {
    return crypto.randomBytes(lengthBytes).toString("base64");
}

async function checkGameIDValidity(gameID: string) {
    return await readGamesData(gameID) != undefined
}

export {generateRandomBase64String, checkGameIDValidity}