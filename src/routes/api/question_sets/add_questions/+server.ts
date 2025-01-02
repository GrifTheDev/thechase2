import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import { readQuestionSetsData, updateQuestionSetsData } from "$lib/database/database";
import type { QuestionsThreeObject } from "$lib/types/misc/question_three_object";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const {id, questions}: {id: string, questions: Array<QuestionsThreeObject>} = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
  };
  /*
    TODO Add types (three and open) and check permissions
  */

  // ! Issue: This is replacing the entire array.
  // * Solution: Although I could make the endpoint accept what is stored in localStorage, it
  // * is dangerous because localStorage can be so easily manipulated.
  // * Instead, it is better to use another read to get the current state of the DB and then
  // * update the array. I tried using arrayUnion, but it threw an error regarding nested arrays.

  const currentQ = (await readQuestionSetsData(id))?.questions_three

  await updateQuestionSetsData(id, {questions_three: [...currentQ!, ...questions]})

  return Response.json(responseObject);
};
