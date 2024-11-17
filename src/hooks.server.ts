import {
  PRIVATE_JWT_ACCESS_TOKEN_SECRET,
  PRIVATE_JWT_REFRESH_TOKEN_SECRET,
} from "$env/static/private";
import {
  invalidateUserAuthTokenPair,
  requestNewTokenPair,
} from "$lib/server/auth/auth";
import { redirect, type Handle, error } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

export const handle = (async ({ event, resolve }) => {
  const route = event.url.pathname;
  const regex = /\/+/g;
  let sanitizedRoute = route.replaceAll(regex, "/");

  // ? Change this so that protected routes can be read from an array
  // !! CHANGE TO /APP ONCE DONE

  if (sanitizedRoute.startsWith("/api/user/login") || sanitizedRoute.startsWith("/api/user/register")) return await resolve(event);

  if (sanitizedRoute.startsWith("/app") || sanitizedRoute.startsWith("/api")) {
    const accessToken = event.cookies.get("AccessToken");
    const refreshToken = event.cookies.get("RefreshToken");
    if (accessToken == undefined || refreshToken == undefined)
      throw redirect(303, "/login");

    // * If access token cannot be verified, this could be due to expiry. Unlike the refresh token, if an access token expires we need to request a new one.
    // * If we receive some other error, like malformed token, we clear everything.
    try {
      jwt.verify(accessToken, PRIVATE_JWT_ACCESS_TOKEN_SECRET);
    } catch (error: any) {
      console.log("hit")
      // * Token has expired. Let's grab a new one!
      if (error.toString().startsWith("TokenExpiredError")) {
        const requestPair = await requestNewTokenPair(
          refreshToken
        )

        // * Errors occured
        if (requestPair == 404 || requestPair == 401 || requestPair == 500) {
          event.cookies.delete("AccessToken", { path: "/" });
          event.cookies.delete("RefreshToken", { path: "/" });
          throw redirect(303, "/login");
        } else {
          event.cookies.set("AccessToken", requestPair.accessToken, {
            secure: true,
            path: "/",
            sameSite: "strict",
          });
          event.cookies.set("RefreshToken", requestPair.refreshToken, {
            secure: true,
            path: "/",
            sameSite: "strict",
          });
        }
      } else {
        await invalidateUserAuthTokenPair(refreshToken, "rt_all")
        event.cookies.delete("AccessToken", { path: "/" });
        event.cookies.delete("RefreshToken", { path: "/" });
        throw redirect(303, "/login");
      }
    }

    //console.log(accessToken, refreshToken);
  }

  return await resolve(event);
}) satisfies Handle;
