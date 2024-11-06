import { PRIVATE_JWT_ACCESS_TOKEN_SECRET } from "$env/static/private";
import type { DBUsersType } from "$lib/types/database/users";
import jwt from "jsonwebtoken";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { RefreshTokenPayloadType } from "$lib/types/tokens/refresh_token";
import { queryWhereUsersData, updateUsersData } from "$lib/database/database";
import { createAccessToken, createRefreshToken } from "./utilities";
import type { AuthTokenPairType } from "$lib/types/tokens/auth_token_pair";

/**
 * @description Function responsible for validating ONLY STORED access and refresh tokens. Called only on LOGIN.
 */
async function validateStoredUserTokens(
  emailHash: string,
  dbData: DBUsersType
): Promise<AuthTokenPairType | undefined> {
  let accessToken = dbData.access_token;
  const refreshToken = await createRefreshToken();

  try {
    jwt.verify(accessToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET);
    await updateUsersData(emailHash, {
      refresh_tokens: [...dbData.refresh_tokens, refreshToken],
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (error: any) {
    // ! There exist two cases in which we can generate a new token pair, without being provided a refresh token:
    // ! Case 1 [error.toString().startsWith("JsonWebTokenError")]
    // * Stored token is somehow corrupted. Since the user HAS authenticated with their password,
    // * aka, we know the user is who they say they are, we can just gen and store a new token pair.

    // ! Case 2 [error.toString().startsWith("TokenExpiredError")]
    // * We are trying to give the user an expired token so we need to renew it. We do not have an access token, since this is the user logging in.
    // * This is then, the one condition under which we will generate a new access token without a refresh token and return both.
    if (
      error.toString().startsWith("JsonWebTokenError") ||
      error.toString().startsWith("TokenExpiredError")
    ) {
      accessToken = await createAccessToken(dbData);
      console.log(
        `[INFO] [user_auth 1] [${
          error.toString().split(":")[0]
        }]:: Detected JWT error on stored access_token. Created new token pair:\n (access_token, refresh_token) = (${accessToken}, ${refreshToken})`
      );
      await updateUsersData(emailHash, {
        access_token: accessToken,
        refresh_tokens: [...dbData.refresh_tokens, refreshToken],
      });
      return { accessToken: accessToken, refreshToken: refreshToken };
    } else {
      console.log(error);
    }
  }
}

async function invalidateSpecificUserTokenPair(
  accessToken: string,
  refreshToken: string
) {
  const querySnapshot = await queryWhereUsersData(
    "access_token",
    accessToken,
    "=="
  );

  if (querySnapshot?.size != 1)
    console.log(
      `detected multiple documents with the same auth token???\n`,
      querySnapshot?.docs
    );

  querySnapshot?.forEach(async (doc) => {
    let refreshTokenArray: Array<string> = doc.get("refresh_tokens");
    let consumedRefreshTokens: Array<string> = doc.get(
      "consumed_refresh_tokens"
    );
    let consumedToken: Array<string> = refreshTokenArray.splice(
      refreshTokenArray.indexOf(refreshToken),
      1
    );

    await updateUsersData(doc.id, {
      access_token: "",
      refresh_tokens: refreshTokenArray,
      consumed_refresh_tokens: [...consumedRefreshTokens, ...consumedToken],
    });
  });
}

async function requestNewTokenPair(
  accessToken: string,
  refreshToken: string
): Promise<AuthTokenPairType | undefined> {
  return undefined;
}

// !IMplement
async function renewAccessToken(
  accessToken: AccessTokenPayloadType,
  refershToken: RefreshTokenPayloadType,
  dbData: DBUsersType | undefined
) {}

export { validateStoredUserTokens, invalidateSpecificUserTokenPair, requestNewTokenPair };
