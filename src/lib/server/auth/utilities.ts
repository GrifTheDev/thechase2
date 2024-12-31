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

import type { DBUsersType, DBUsersTypeWrite } from "$lib/types/database/users";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { UserPermissionsType } from "$lib/types/misc/user_permissions";
import type { AuthTokenPairType } from "$lib/types/tokens/auth_token_pair";
import { updateUsersData } from "$lib/database/database";

// ! Can generate strings with "/", which is dangerous for using with firestore.
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

async function createAccessToken(usrData: {
  name: string;
  permissions: UserPermissionsType;
}): Promise<string> {
  const accessTokenPayload: AccessTokenPayloadType = {
    name: usrData.name,
    permissions: usrData.permissions,
    salt: generateRandomBase64String(16),
  };
  return jwt.sign(accessTokenPayload, PRIVATE_JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: PRIVATE_ACCESS_TOKEN_LIFETIME,
  });
}

async function createRefreshToken(): Promise<string> {
  return jwt.sign(
    { salt: generateRandomBase64String(32) },
    PRIVATE_JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: PRIVATE_REFRESH_TOKEN_LIFETIME }
  );
}

async function userDBInit(
  docID: string,
  inData: { name: string; surname: string; email: string; password: string }
): Promise<AuthTokenPairType> {
  let data: DBUsersTypeWrite = {};

  // * Just now realising how cool this type actually is. Typefuckery is sometimes amazing.
  const defaultPermissionSet: UserPermissionsType = {
    question_sets: { access: "readwrite", docs: [] },
    users: { access: "readwrite", docs: [docID] },
  };

  const AT = await createAccessToken({
    name: inData.name,
    permissions: defaultPermissionSet,
  });
  const RT = await createRefreshToken()

  data.access_token = AT
  data.refresh_tokens = [RT]
  data.consumed_refresh_tokens = []
  data.permissions = defaultPermissionSet

  Object.assign(data, inData);

  await updateUsersData(docID, data)

  return {accessToken: AT, refreshToken: RT}
}

export {
  generateRandomBase64String,
  createConstantSaltHash,
  createAccessToken,
  createRefreshToken,
  userDBInit
};
