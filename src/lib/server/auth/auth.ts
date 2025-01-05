import {
  PRIVATE_JWT_ACCESS_TOKEN_SECRET,
  PRIVATE_JWT_REFRESH_TOKEN_SECRET,
} from "$env/static/private";
import type { DBUsersType } from "$lib/types/database/users";
import jwt from "jsonwebtoken";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import type { RefreshTokenPayloadType } from "$lib/types/tokens/refresh_token";
import { queryWhereUsersData, updateUsersData } from "$lib/database/database";
import { createAccessToken, createRefreshToken } from "./utilities";
import type { AuthTokenPairType } from "$lib/types/tokens/auth_token_pair";
import { error } from "@sveltejs/kit";
import { logger } from "../logger/logger";

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
      logger.log({
        level: "info",
        service: "AUTH",
        metadata: "validateStoredUserTokens",
        message: `Detected JWT error on stored access_token for document keyed ${dbData.email}. Creating new token pair.`,
      });
      accessToken = await createAccessToken(dbData);
      await updateUsersData(emailHash, {
        access_token: accessToken,
        refresh_tokens: [...dbData.refresh_tokens, refreshToken],
      });
      return { accessToken: accessToken, refreshToken: refreshToken };
    } else {
      logger.log({
        level: "error",
        service: "AUTH",
        metadata: "validateStoredUserTokens",
        message: `An unexpected error occured while trying to validate token: ${error}`,
      });
    }
  }
}

/**
 * @description This function should be called whenever you want to invalidate user auth tokens.
 */
async function invalidateUserAuthTokenPair(
  refreshToken: string,
  options: "rt_specific" | "rt_all",
  dbData?: DBUsersType & { id: string | undefined }
): Promise<200 | 404 | 500> {
  /* let docData: DBUsersType = queryDocs.docs[0].data();
  let docID = queryDocs.docs[0].id; */

  let docData: DBUsersType;
  let docID: string;

  if (dbData != undefined) {
    if (dbData.id == undefined) return 500;
    docID = dbData.id;
    delete dbData.id;
    docData = dbData;
  } else {
    let queryDocs = await queryWhereUsersData(
      "refresh_tokens",
      refreshToken,
      "array-contains",
      "first"
    );

    if (queryDocs == undefined) {
      let checkConsumedTokens = await queryWhereUsersData(
        "consumed_refresh_tokens",
        refreshToken,
        "array-contains",
        "first"
      );

      if (checkConsumedTokens == undefined) {
        return 404;
      } else {
        queryDocs = checkConsumedTokens;
      }
    }

    docData = queryDocs.docs[0].data();
    docID = queryDocs.docs[0].id;
  }

  let refreshTokenArray: Array<string> = docData.refresh_tokens;
  let consumedRefreshTokens: Array<string> = docData.consumed_refresh_tokens;

  switch (options) {
    case "rt_specific":
      const oldTokenIndex = refreshTokenArray.indexOf(refreshToken);
      if (oldTokenIndex == -1) {
        logger.log({
          level: "info",
          service: "AUTH",
          metadata: "invalidateUserAuthTokenPair",
          message: `The flag "rt_specific" was passed to the function, however, the search for the provided refresh_token returned -1.`,
        });
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
        consumed_refresh_tokens: [
          ...consumedRefreshTokens,
          ...refreshTokenArray,
        ],
      });

      return 200;
  }
}

async function requestNewTokenPair(
  refreshToken: string
): Promise<AuthTokenPairType | 401 | 404 | 500> {
  try {
    jwt.verify(refreshToken, PRIVATE_JWT_REFRESH_TOKEN_SECRET);
  } catch (err: any) {
    let invalidationOption: "rt_specific" | "rt_all" = err
      .toString()
      .startsWith("TokenExpiredError")
      ? "rt_specific"
      : "rt_all";

    const invalidationResult = await invalidateUserAuthTokenPair(
      refreshToken,
      invalidationOption
    );
    if (invalidationResult == 404) {
      return 404;
    } else if (invalidationResult == 500) {
      throw error(500, { message: "Whoops!", devDump: err });
    } else {
      return 401;
    }
  }

  // * Refresh token is valid.

  let queryDocs = await queryWhereUsersData(
    "refresh_tokens",
    refreshToken,
    "array-contains",
    "first"
  );

  if (queryDocs == undefined) {
    let checkConsumedTokens = await queryWhereUsersData(
      "consumed_refresh_tokens",
      refreshToken,
      "array-contains",
      "first"
    );

    // * Since the first query failed and the second one returned a valid document we know the refresh token is consumed.
    // * This, however, relies on the fact that no access token can be present in both "refresh_tokens" & "consumed_refresh_tokens"
    // * at the same time.
    if (checkConsumedTokens != undefined) {
      logger.log({
        level: "info",
        service: "AUTH",
        metadata: "requestNewTokenPair",
        message: `An attempt has been made to use a consumed refresh token to aquire a new access token (resetting all tokens). Consumed refresh token: ${refreshToken}`,
      });
      await invalidateUserAuthTokenPair(
        refreshToken,
        "rt_all",
        Object.assign(checkConsumedTokens.docs[0].data(), {
          id: checkConsumedTokens.docs[0].id,
        })
      );
      return 401;
    } else {
      return 404;
    }
  }
  // * We found a valid document, the refresh token has not been consumed, the access token is valid. Best case, and most likely, scenario :)
  else {
    await invalidateUserAuthTokenPair(refreshToken, "rt_specific");
    const docData = queryDocs.docs[0].data();
    const docID = queryDocs.docs[0].id;
    const refreshTokens = docData.refresh_tokens;
    const newRefreshToken = await createRefreshToken();
    const newAccessToken = await createAccessToken(docData);

    // * We need to remove the refreshToken since the query was from an older version that has not been invalidated.
    if (refreshTokens.indexOf(refreshToken) == -1)
      throw error(500, { message: "this should never fukin happen." });
    refreshTokens.splice(refreshTokens.indexOf(refreshToken), 1);
    refreshTokens.push(newRefreshToken);

    await updateUsersData(docID, {
      access_token: newAccessToken,
      refresh_tokens: refreshTokens,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

export {
  validateStoredUserTokens,
  invalidateUserAuthTokenPair,
  requestNewTokenPair,
};
