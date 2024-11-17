import { readQuestionSetsData } from "$lib/database/database";
import type { RequestHandler } from "./$types";
//import { json } from "@sveltejs/kit" return json(a+b)

export const GET: RequestHandler = async ({ request, locals, cookies }) => {

  //const { questionSetID } = await request.json();
  /* const IDs = await readQuestionSetsData(locals.user.token)
  if (IDs == undefined) return new Response(JSON.stringify({code: 200, keys: []})) */
    
  return new Response(JSON.stringify({code: 200, keys: Object.keys("1")}))
};
