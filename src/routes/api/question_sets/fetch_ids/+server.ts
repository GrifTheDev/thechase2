import { readQuestionSetsData } from "$lib/database/database";
import type { RequestHandler } from "./$types";
//import { json } from "@sveltejs/kit" return json(a+b)

export const GET: RequestHandler = async ({ request, locals, cookies }) => {
  if (locals.user == undefined) {
    // ? Do I even need to delete it here since middleware handles unsigned JWTs.
    if (cookies.get("AuthorizationToken") != undefined) cookies.delete("AuthorizationToken", {path: "/"})
    return new Response(JSON.stringify({ code: 403, message: `Forbidden` }));
  }

  //const { questionSetID } = await request.json();
  const IDs = await readQuestionSetsData(locals.user.token)
  if (IDs == undefined) return new Response(JSON.stringify({code: 200, keys: []}))
    
  return new Response(JSON.stringify({code: 200, keys: Object.keys(IDs)}))
};
