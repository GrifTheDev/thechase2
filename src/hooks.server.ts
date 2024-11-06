import {
  PRIVATE_JWT_REFRESH_TOKEN_SECRET,
  PRIVATE_REFRESH_TOKEN_LIFETIME,
} from "$env/static/private";
import { queryWhereUsersData, updateUsersData } from "$lib/database/database";
import { invalidateSpecificUserTokenPair } from "$lib/server/auth";
import type { AccessTokenPayloadType } from "$lib/types/tokens/access_token";
import { redirect, type Handle } from "@sveltejs/kit";
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
    // * We don't care for the specific reason, but if the try fails, aka goes to catch, we just want to delete everything and throw to /login
    try {
      jwt.verify(refreshToken, PRIVATE_JWT_REFRESH_TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      
      await invalidateSpecificUserTokenPair(accessToken, refreshToken)
      event.cookies.delete(accessToken, { path: "/" });
      event.cookies.delete(refreshToken, { path: "/" });
      throw redirect(303, "/login")
    }

    //console.log(accessToken, refreshToken);
  }

  return await resolve(event);
}) satisfies Handle;
