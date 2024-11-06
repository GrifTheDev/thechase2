import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";

import {
    PRIVATE_ACCESS_TOKEN_LIFETIME,
  PRIVATE_CONSTANT_HASH_SALT,
  PRIVATE_CONSTANT_HASH_SALT_ROUNDS,
  PRIVATE_JWT_ACCESS_TOKEN_SECRET,
  PRIVATE_JWT_REFRESH_TOKEN_SECRET,
  PRIVATE_REFRESH_TOKEN_LIFETIME,
} from "$env/static/private";

import type { DBUsersType } from "$lib/types/database/users";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";

function generateRandomBase64String(lengthBytes: number): string {
  return crypto.randomBytes(lengthBytes).toString("base64");
}

/**
 * @description Use this whenever you want to hash something with `sha256`.
 */
async function createConstantSaltHash(data: string) {
  const pbkdf2Async = promisify(crypto.pbkdf2);

  // * We have to replace all the / because firestore no likey them
  const hash = (
    await pbkdf2Async(
      data,
      PRIVATE_CONSTANT_HASH_SALT,
      Number(PRIVATE_CONSTANT_HASH_SALT_ROUNDS),
      12,
      "sha256"
    )
  )
    .toString("base64")
    .replaceAll("/", "");
  return hash;
}

async function createAccessToken(dbData: DBUsersType): Promise<string> {
    const accessTokenPayload: AccessTokenPayloadType = {
        name: dbData.name,
        permissions: dbData.permissions,
        salt: generateRandomBase64String(16),
      };
      return jwt.sign(
        accessTokenPayload,
        PRIVATE_JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: PRIVATE_ACCESS_TOKEN_LIFETIME }
      );
}

async function createRefreshToken(): Promise<string> {
    return jwt.sign(
        { salt: generateRandomBase64String(32) },
        PRIVATE_JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: PRIVATE_REFRESH_TOKEN_LIFETIME }
      );
}

export { generateRandomBase64String, createConstantSaltHash, createAccessToken, createRefreshToken };
