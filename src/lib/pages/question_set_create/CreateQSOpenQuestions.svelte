<script lang="ts">
    import Heading1 from "$lib/components/headings/Heading1.svelte";
    import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
    import BlueButton from "$lib/components/buttons/BlueButton.svelte";
    import PurpleFillButton from "$lib/components/buttons/PurpleFillButton.svelte";
    import { browser } from "$app/environment";
    import RedButton from "$lib/components/buttons/RedButton.svelte";
    import type { QuestionsThreeObject } from "$lib/types/misc/question_three_object";
    import { PUBLIC_QUESTION_ANSWER_LENGTH } from "$env/static/public";
    import GreenButton from "$lib/components/buttons/GreenButton.svelte";
    import type { QuestionSetType } from "$lib/types/database/question_sets";
    import type { ServerResponseType } from "$lib/types/misc/server_response";
    import { redirect } from "@sveltejs/kit";
  
    let questionsToSave: Array<QuestionsThreeObject> = $state([]);
    let localStorageQuestions: Array<QuestionsThreeObject> = $state([]);
  
    if (browser) {
      // @ts-ignore
      // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
      // * for TS to understand this.
      const questionSetCreationObject: QuestionSetType = JSON.parse(localStorage.getItem("QSCP"));
      if (questionSetCreationObject != null) {
        localStorageQuestions = questionSetCreationObject.questions_three;
      }
    }
    let currentInputQuestions: QuestionsThreeObject = $state({
      label: "",
      answerA: "",
      answerB: "",
      answerC: "",
      correctAnswer: "",
    });
  
    let answerLengths = $derived([
      Number(PUBLIC_QUESTION_ANSWER_LENGTH) -
        currentInputQuestions.answerA.length,
      Number(PUBLIC_QUESTION_ANSWER_LENGTH) -
        currentInputQuestions.answerB.length,
      Number(PUBLIC_QUESTION_ANSWER_LENGTH) -
        currentInputQuestions.answerC.length,
    ]);
  
    function dialogOpen() {
      if (browser) {
        const dialog = document.querySelector("dialog");
        dialog?.showModal();
      }
    }
  
    function dialogClose() {
      if (browser) {
        const dialog = document.querySelector("dialog");
        dialog?.close();
      }
    }
  
    async function submitNewQuestionToSet() {
      // TODO add some loading while this fetches.
      questionsToSave.push({
        label: currentInputQuestions.label,
        answerA: currentInputQuestions.answerA,
        answerB: currentInputQuestions.answerB,
        answerC: currentInputQuestions.answerC,
        correctAnswer: currentInputQuestions.correctAnswer,
      });
      // @ts-ignore
      // TODO I have no idea why TS keeps throwing a fit about this being an implicit any type.
      for (var member in currentInputQuestions) currentInputQuestions[member] = "";
  
      dialogClose();
    }
  
    async function submitSavedQuestionsToSet() {
      // * 1. send fetch request and save the batch to DB
      // * 2. update localstorage
      let questionSetCreationObject: QuestionSetType & { id: string } | null = null;
      if (browser) {
        // @ts-ignore
        // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
        // * for TS to understand this.
        questionSetCreationObject = JSON.parse(localStorage.getItem("QSCP"));
      }
      if (questionSetCreationObject == null) return console.log("what the fuckk (submitSavedQuestionsToSet)");
      const req = await fetch("/api/question_sets/add_questions", {
        method: "POST",
        body: JSON.stringify({ id: questionSetCreationObject.id, questions: questionsToSave }),
      });
  
      const res: ServerResponseType = await req.json();
      if (res.code == 200 && browser) {
        localStorageQuestions = [...questionSetCreationObject.questions_three, ...questionsToSave]
        questionSetCreationObject.questions_three = [...questionSetCreationObject.questions_three, ...questionsToSave]
        localStorage.setItem("QSCP", JSON.stringify(questionSetCreationObject));
        questionsToSave = []
      }
    }
  </script>
  
  <div class="flex flex-row justify-center items-center space-x-1">
    <p
      class="font-bold text-2xl text-white rounded-full border-[2px] border-white flex items-center justify-center p-5 w-14 h-14"
    >
      3
    </p>
    <Heading1 label="Questions - Open Answers" />
  </div>
  <DefaultParagraph
    label="Now's the time to add some questions! Please follow the amount guide below."
  />
  
  <div class="flex flex-row space-x-3 items-center justify-center">
    <BlueButton textSize="md" label="Continue" disabledState={localStorageQuestions.length <= 30}></BlueButton>
    <GreenButton
      title={questionsToSave.length > 0 ? "You have changes to save!" : ""}
      textSize="md"
      clickAction={submitSavedQuestionsToSet}
      label="Save"
      disabledState={questionsToSave.length == 0}
    ></GreenButton>
  </div>
  <p class="hidden text-black">p</p>
  