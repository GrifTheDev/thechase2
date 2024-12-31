import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const {} = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
  };

  return Response.json(responseObject);
};
