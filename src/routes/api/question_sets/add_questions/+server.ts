import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import { readQuestionSetsData, updateQuestionSetsData } from "$lib/database/database";
import type { QuestionsThreeObject } from "$lib/types/misc/question_three_object";
import { QuestionSetCache } from "$lib/server/cache/stores/question_sets_cache";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const {id, questions}: {id: string, questions: Array<QuestionsThreeObject>} = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
  };
  /*
    TODO Add types (three and open) and check permissions
  */

  let currentQuestionSetData = await readQuestionSetsData(id)
  if (currentQuestionSetData == null) {
    responseObject.code = 500
    responseObject.message = "INternal server error"
    return Response.json(responseObject)
  }

  const currentQ = currentQuestionSetData.questions_three
  await updateQuestionSetsData(id, {questions_three: [...currentQ, ...questions]})

  currentQuestionSetData.questions_three = [...currentQ, ...questions]
  QuestionSetCache.set(id, currentQuestionSetData)

  return Response.json(responseObject);
};
