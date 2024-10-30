import { PRIVATE_JWT_SECRET } from "$env/static/private";
import type { AuthCookieType } from "$lib/types/misc/auth_cookie";
import { redirect, type Handle } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

export const handle = (async ({ event, resolve }) => {
  const token = event.cookies.get("AuthorizationToken");
  const isProtectedAppRoute = event.url.pathname.split('/').includes("app")
  
  if (token != undefined) {
    try {
        const userInfo = jwt.verify(token, PRIVATE_JWT_SECRET) as AuthCookieType
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
}) satisfies Handle; 