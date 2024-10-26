import { PRIVATE_JWT_SECRET } from "$env/static/private";
import type { AuthCookieType } from "$lib/types/misc/auth_cookie";
import type { Handle } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

export const handle = (async ({ event, resolve }) => {
  const token = event.cookies.get("AuthorizationToken");

  if (token != undefined) {
    try {
        const userInfo = jwt.verify(token, PRIVATE_JWT_SECRET) as AuthCookieType

        event.locals.user = userInfo

    } catch (error) {
        // !!TEST POSSIBLE CASES WHERE THIS HITS
        // ? WHAT HAPPENS WHEN JWT.VERIFY FAILS?
        console.error(error)
    }
  }

  return await resolve(event);
}) satisfies Handle; 