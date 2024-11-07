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

/**
 * @description This function should be called whenever you want to invalidate user auth tokens.
 */
async function invalidateUserAuthTokenPair(
  accessToken: string,
  refreshToken: string,
  options: "rt_specific" | "rt_all"
): Promise<200 | 401 | 500> {
  const querySnapshot = await queryWhereUsersData(
    "access_token",
    accessToken,
    "=="
  );

  // * This can most likely happen if the access_token was reset in the database, causing the system not to be able to find it.
  if (querySnapshot?.size == 0) {
    console.log(`[WARN] [INVALIDATE_TOKEN_PAIR]:: Could not find the document with the provided access token. Request new authorization.\n\n ${accessToken} ${refreshToken}`)
    return 401
  } 
  // * This should still never trigger.
  else if (querySnapshot?.size != 1) {
    console.log(
      `detected multiple documents with the same auth token???\n`,
      querySnapshot?.docs
    );
    return 500
  }
  if (querySnapshot == undefined) return 500;

  const docData = querySnapshot.docs[0].data();
  const docID = querySnapshot.docs[0].id;

  let refreshTokenArray: Array<string> = docData.refresh_tokens;
  let consumedRefreshTokens: Array<string> = docData.consumed_refresh_tokens;

  switch (options) {
    case "rt_specific":
      const oldTokenIndex = refreshTokenArray.indexOf(refreshToken);
      if (oldTokenIndex == -1) {
        console.log(
          `[WARN] [AUTH_TOKEN_PAIR_INVALIDATION] :: The flag "rt_specific" was passed to the function, however, the search for the provided refresh_token returned -1.\n\nDB DATA: ${JSON.stringify(docData)}`
        );
        return 500;
      } else {
        let consumedToken: Array<string> = refreshTokenArray.splice(
          refreshTokenArray.indexOf(refreshToken),
          1
        );
        await updateUsersData(docID, {
          access_token: "",
          refresh_tokens: refreshTokenArray,
          consumed_refresh_tokens: [...consumedRefreshTokens, ...consumedToken],
        });
      }
      return 200;
    case "rt_all":
      await updateUsersData(docID, {
        access_token: "",
        refresh_tokens: [],
        consumed_refresh_tokens: [...consumedRefreshTokens, ...refreshTokenArray],
      });

      return 200;
  }
}

// * 0. Since hooks checks the refresh token first, we know that at this point we will get a valid refresh token.
// *    We also know the access token is valid, since it returned the Expired error. TLDR; we have a working token pair
//*     But just the access token is expired.

// ? 2. Check if the refresh token provided is in the used tokens - if so, call invalidateSpecificUserTokenPair and return "danger"
// ? 3. At this point we've verified that both tokens and are ready to start the process. We generate a new access token & a new refresh token
// ?    We can call the invalidate specific user token pair and then add the new token pair and return it.
// ? 4. Declare better return types
async function requestNewTokenPair(
  accessToken: string,
  refreshToken: string
): Promise<AuthTokenPairType | undefined | "danger"> {
  const querySnapshot = await queryWhereUsersData(
    "access_token",
    accessToken,
    "=="
  );

  // * I am 90% confident this will never trigger.
  if (querySnapshot?.size != 1)
    console.log(
      `detected multiple documents with the same auth token???\n`,
      querySnapshot?.docs
    );

  if (querySnapshot == undefined) return undefined;

  const docData = querySnapshot.docs[0].data();
  const consumedRefreshTokens = docData.consumed_refresh_tokens;

  // TODO expand on the invalidation function, the below should clear all refresh tokens.
  if (consumedRefreshTokens.includes(refreshToken)) {
    console.log(
      `[DANGER] [AUTH] :: An attempt is being made to use a consumed refresh token to aquire a new access token. Dump:\n ${docData}`
    );
    await invalidateUserAuthTokenPair(accessToken, refreshToken, "rt_specific");
    return "danger";
  } else {
    // all good!
  }

  return undefined;
}

// !IMplement
async function renewAccessToken(
  accessToken: AccessTokenPayloadType,
  refershToken: RefreshTokenPayloadType,
  dbData: DBUsersType | undefined
) {}

export {
  validateStoredUserTokens,
  invalidateUserAuthTokenPair,
  requestNewTokenPair,
};
