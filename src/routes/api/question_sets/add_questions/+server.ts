import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import { updateQuestionSetsData } from "$lib/database/database";
import type { QuestionsThreeObject } from "$lib/types/misc/question_three_object";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const {id, questions}: {id: string, questions: Array<QuestionsThreeObject>} = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
  };


  // Issue this is replacing the entire array
  // questions are appearing duplicate in table.
  await updateQuestionSetsData(id, {questions_three: questions})

  return Response.json(responseObject);
};
