import type { RequestHandler } from "./$types";
import type { ServerResponseType } from "$lib/types/misc/server_response";
import {
  readQuestionSetsData,
  updateQuestionSetsData,
} from "$lib/database/database";
import type { QuestionsThreeObject } from "$lib/types/misc/question_three_object";
import { QuestionSetCache } from "$lib/server/cache/stores/question_sets_cache";
import type { QuestionOpenType } from "$lib/types/misc/question_open_object";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const {
    id,
    questions,
    type,
  }: {
    id: string;
    questions: Array<QuestionsThreeObject> | Array<QuestionOpenType>;
    type: "open" | "three";
  } = await request.json();

  let responseObject: ServerResponseType = {
    code: 200,
    message: "Success",
  };
  if (type == "three") {
    let currentQuestionSetData = await readQuestionSetsData(id);
    if (currentQuestionSetData == null) {
      responseObject.code = 500;
      responseObject.message = "INternal server error";
      return Response.json(responseObject);
    }

    const currentQ = currentQuestionSetData.questions_three;
    await updateQuestionSetsData(id, {
      questions_three: [
        ...currentQ,
        ...(questions as Array<QuestionsThreeObject>),
      ],
    });

    currentQuestionSetData.questions_three = [
      ...currentQ,
      ...(questions as Array<QuestionsThreeObject>),
    ];
    QuestionSetCache.set(id, currentQuestionSetData);

    return Response.json(responseObject);
  } else if (type == "open") {
    let currentQuestionSetData = await readQuestionSetsData(id);
    if (currentQuestionSetData == null) {
      responseObject.code = 500;
      responseObject.message = "INternal server error";
      return Response.json(responseObject);
    }

    const currentQ = currentQuestionSetData.questions_open;
    await updateQuestionSetsData(id, {
      questions_open: [...currentQ, ...(questions as Array<QuestionOpenType>)],
    });

    currentQuestionSetData.questions_open = [
      ...currentQ,
      ...(questions as Array<QuestionOpenType>),
    ];
    QuestionSetCache.set(id, currentQuestionSetData);

    return Response.json(responseObject);
  } else {
    responseObject.code = 500;
      responseObject.message = "INternal server error";
      return Response.json(responseObject);
  }
};
