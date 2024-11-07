import {
  PRIVATE_JWT_ACCESS_TOKEN_SECRET,
  PRIVATE_JWT_REFRESH_TOKEN_SECRET,
  PRIVATE_REFRESH_TOKEN_LIFETIME,
} from "$env/static/private";
import { queryWhereUsersData, updateUsersData } from "$lib/database/database";
import {
  invalidateUserAuthTokenPair,
  requestNewTokenPair,
} from "$lib/server/auth/auth";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import { redirect, type Handle, error } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

/* export const handle = (async ({ event, resolve }) => {
  const token = event.cookies.get("AuthorizationToken");
  const isProtectedAppRoute = event.url.pathname.split('/').includes("app")
  
  if (token != undefined) {
    try {
        const userInfo = jwt.verify(token, PRIVATE_JWT_SECRET) as AccessTokenType
        event.locals.user = userInfo
    } catch (error: any) {
      // * Checking if JWT signature verification failed.
      if (error.toString().startsWith("JsonWebTokenError")) {
        console.log("[INFO] [MIDDLEWARE] :: JWT signature verification FAILED. Assuming the token was compromized and deleting the cookie.")
        event.cookies.delete("AuthorizationToken", {
          path: "/"
        })
        throw redirect(303, "/login")
      } else {
        console.log(`[ERR] [MIDDLEWARE] :: ${error}`)
      }
    }
  } else if (isProtectedAppRoute) {
    // * User did not log in and is trying to access a protected route.
    throw redirect(303, "/login")
  }

  return await resolve(event);
}) satisfies Handle;  */
// ? 3. Verify access token with JWT and expiry on refresh token
// ? 4. If access token expired, consume refresh token and gen a new pair
// ? 5. If refresh token is in the consumed_refresh_tokens array in the DB, invalidate all tokens.
export const handle = (async ({ event, resolve }) => {
  const route = event.url.pathname;
  const regex = /\/+/g;
  let sanitizedRoute = route.replaceAll(regex, "/");

  // ? Change this so that protected routes can be read from an array
  // !! CHANGE TO /APP ONCE DONE
  if (sanitizedRoute.startsWith("/test")) {
    const accessToken = event.cookies.get("AccessToken");
    const refreshToken = event.cookies.get("RefreshToken");

    if (accessToken == undefined || refreshToken == undefined)
      throw redirect(303, "/login");

    // * Check if refresh token expired or is somehow broken first. If so, purge DB and cookies and return to login/
    try {
      jwt.verify(refreshToken, PRIVATE_JWT_REFRESH_TOKEN_SECRET);
    } catch (err: any) {
      console.log(err);
      let invalidationOption: "rt_specific" | "rt_all" = err.toString().startsWith("TokenExpiredError") ? "rt_specific" : "rt_all" 

      const invalidationResult = await invalidateUserAuthTokenPair(accessToken, refreshToken, invalidationOption);
      if (invalidationResult == 401 || invalidationResult == 200) {
        event.cookies.delete("AccessToken", { path: "/" });
        event.cookies.delete("RefreshToken", { path: "/" });
      } else {
        throw error(500, {message: "The server returned an error while trying to run middleware"})
      }
      throw redirect(303, "/login");
    }

    // * If access token cannot be verified, this could be due to expiry. Unlike the refresh token, if an access token expires we need to request a new one.
    // * If we receive some other error, like malformed token, we clear everything.
    try {
      jwt.verify(accessToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET);
    } catch (error: any) {
      console.log("hit")
      // * Token has expired. Let's grab a new one!
      if (error.toString().startsWith("TokenExpiredError")) {
        const requestPair = await requestNewTokenPair(
          accessToken,
          refreshToken
        );
        if (requestPair == "danger") {
          event.cookies.delete(accessToken, { path: "/" });
          event.cookies.delete(refreshToken, { path: "/" });
          throw redirect(303, "/login");
        }
      }
    }

    //console.log(accessToken, refreshToken);
  }

  return await resolve(event);
}) satisfies Handle;
