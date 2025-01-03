<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import PurpleFillButton from "$lib/components/buttons/BlueFillButton.svelte";
  import { browser } from "$app/environment";
  import RedButton from "$lib/components/buttons/RedButton.svelte";
  import type { QuestionsThreeObject } from "$lib/types/misc/question_three_object";
  import { PUBLIC_QUESTION_ANSWER_LENGTH } from "$env/static/public";
  import GreenButton from "$lib/components/buttons/GreenButton.svelte";
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  import type { ServerResponseType } from "$lib/types/misc/server_response";
  import { redirect } from "@sveltejs/kit";
  import type { QuestionOpenType } from "$lib/types/misc/question_open_object";
  import BlueFillButton from "$lib/components/buttons/BlueFillButton.svelte";
  import { qSetCreation } from "$lib/states/question_set_creation.svelte";

  let questionsToSave: Array<QuestionOpenType> = $state([]);
  let localStorageQuestions: Array<QuestionOpenType> = $state([]);
  let currentOpenEndedQuestionObject: QuestionOpenType = $state({
    label: "",
    answer: "",
  });

  if (browser) {
    // @ts-ignore
    // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
    // * for TS to understand this.
    const questionSetCreationObject: QuestionSetType = JSON.parse(localStorage.getItem("QSCP"));
    if (questionSetCreationObject != null) {
      localStorageQuestions = questionSetCreationObject.questions_open;
    }
  }

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

  function submitNewQuestionToSet() {
    questionsToSave.push({
      label: currentOpenEndedQuestionObject.label,
      answer: currentOpenEndedQuestionObject.answer,
    });
    // @ts-ignore
    for (var member in currentOpenEndedQuestionObject) currentOpenEndedQuestionObject[member] = "";

    dialogClose();
  }

  async function submitSavedQuestionsToSet() {
    let questionSetCreationObject: (QuestionSetType & { id: string }) | null =
      null;
    if (browser) {
      // @ts-ignore
      // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
      // * for TS to understand this.
      questionSetCreationObject = JSON.parse(localStorage.getItem("QSCP"));
    }
    if (questionSetCreationObject == null)
      return console.log("what the fuckk (submitSavedQuestionsToSet)");
    const req = await fetch("/api/question_sets/add_questions", {
      method: "POST",
      body: JSON.stringify({
        id: questionSetCreationObject.id,
        questions: questionsToSave,
        type: "open",
      }),
    });

    const res: ServerResponseType = await req.json();
    if (res.code == 200 && browser) {
      localStorageQuestions = [
        ...questionSetCreationObject.questions_open,
        ...questionsToSave,
      ];
      questionSetCreationObject.questions_open = [
        ...questionSetCreationObject.questions_open,
        ...questionsToSave,
      ];
      localStorage.setItem("QSCP", JSON.stringify(questionSetCreationObject));
      questionsToSave = [];
    }
  }

  async function advanceProgress() {
    let questionSetCreationObject: (QuestionSetType & { id: string }) | null =
      null;
    if (browser) {
      // @ts-ignore
      // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
      // * for TS to understand this.
      questionSetCreationObject = JSON.parse(localStorage.getItem("QSCP"));
    }
    if (questionSetCreationObject == null)
      return console.log("what the fuckk (submitSavedQuestionsToSet)");

    questionSetCreationObject.progress += 1;

    await fetch("/api/question_sets/advance_setup", {
      method: "POST",
      body: JSON.stringify({
        id: questionSetCreationObject.id,
        newProgress: questionSetCreationObject.progress,
      }),
    });

    localStorage.setItem("QSCP", JSON.stringify(questionSetCreationObject));
    qSetCreation.progress = questionSetCreationObject.progress;
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
  label="Please add at least 30 open-ended questions. These questions will be used for things like the final chase."
/>

<div
  class="w-[25%] h-8 border-[3px] border-white rounded-sm flex flex-row bg-opacity-50 relative"
>
  <progress
    value={(questionsToSave.length + localStorageQuestions.length).toString()}
    max="30"
    class="progress-filled:bg-white bg-transparent w-1/6"
  >
  </progress>
  <span class="h-10 w-[2px] rounded-md bg-blue-300"
    ><p class="translate-y-9 text-blue-300">Minimum (30)</p></span
  >
  <progress
    value={(
      questionsToSave.length +
      localStorageQuestions.length -
      30
    ).toString()}
    max="40"
    class="progress-filled:bg-white bg-transparent w-1/3"
  >
  </progress>
  <span class="h-10 w-[2px] rounded-md bg-blue-300"
    ><p class="translate-y-9 text-blue-300">Recommended (100)</p></span
  >
  <progress
    value={(
      questionsToSave.length +
      localStorageQuestions.length -
      70
    ).toString()}
    max="500"
    class="progress-filled:bg-white bg-transparent w-1/2"
  >
  </progress>
  <span
    class="absolute right-0 h-10 w-[2px] rounded-md bg-blue-300 translate-x-[2.5px]"
    ><p class="translate-y-9 text-blue-300">Maximum (500)</p></span
  >
</div>

<div class="w-100% h-10"></div>

<div class="flex flex-row space-x-3 items-center justify-center">
  <BlueFillButton
    textSize="md"
    label="+ Add Question"
    clickAction={dialogOpen}
  ></BlueFillButton>
  <GreenButton
    title={questionsToSave.length > 0 ? "You have changes to save!" : ""}
    textSize="md"
    label="Save"
    clickAction={submitSavedQuestionsToSet}
    disabledState={questionsToSave.length == 0}
  ></GreenButton>
  <BlueButton
    textSize="md"
    label="Continue"
    clickAction={advanceProgress}
    disabledState={localStorageQuestions.length <= 30}
  ></BlueButton>
</div>
<dialog
  class="bg-transparent overflow-hidden w-[100%] h-[100%] open:animate-modalSpawn"
>
  <div class="w-screen h-screen flex justify-center space-y-3 items-center">
    <div class="bg-nav-bg w-[54%] h-2/3 p-4 space-y-2 flex flex-col rounded-lg">
      <div class="text-center border-b pb-2 border-white">
        <Heading1 label="Create Question" />
      </div>

      <p class="text-white font-light">Question</p>
      <textarea
        class="rounded-lg w-100% h-100% pl-2 pr-11 pb-0 text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none"
        placeholder="Time for you to write a question. Make it a good one!"
        bind:value={currentOpenEndedQuestionObject.label}
      ></textarea>

      <p class="text-white font-light">Answer</p>
      <textarea
        class="rounded-lg w-100% pl-2 pr-11 pb-0 text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none"
        placeholder="In case you couldn't tell, the answer goes here."
        bind:value={currentOpenEndedQuestionObject.answer}
      ></textarea>

      <p class="text-white break-words text-center italic">
        Open-ended questions are used for the point builder and final hunt
        stages of the game. While the minimum required amount is 30, we
        recommend making at least 70 open-ended questions. The system will
        automatically start repeating questions in the game once 85% of the
        questions are used.
      </p>

      <div class="flex flex-grow"></div>
      <div class="flex flex-row space-x-1 m-auto">
        <BlueButton
          label="Add Question"
          textSize="md"
          clickAction={submitNewQuestionToSet}
          disabledState={Object.values(currentOpenEndedQuestionObject).includes(
            ""
          )}
        />
        <RedButton label="Exit" textSize="md" clickAction={dialogClose} />
      </div>
    </div>
  </div>
</dialog>

<table class="w-full text-white text-center font-regular table-fixed">
  <thead class="bg-gray-900 font-light text-md">
    <tr>
      <th class="py-2">
        Question {questionsToSave.length > 0
          ? `(You have ${questionsToSave.length} unsaved question${questionsToSave.length == 1 ? "" : "s"}!)`
          : ""}
      </th>
      <th class="py-2"> Answer</th>
    </tr>
  </thead>
  <tbody class="text-md">
    {#each questionsToSave as q, i}
      <tr class="bg-red-400 bg-opacity-75 border-b border-gray-700">
        <td class="py-2 px-2 break-all w-50% border-r border-gray-700">
          {q.label}
        </td>
        <td class="py-2 px-2 break-all w-50%">{q.answer}</td>
      </tr>
    {/each}

    {#each localStorageQuestions as l, i}
      <tr class="bg-gray-800 border-b border-gray-700">
        <td class="py-2 px-2 break-all w-50% border-r border-gray-700">
          {l.label}
        </td>
        <td class="py-2 px-2 break-all w-50%">{l.answer}</td>
      </tr>
    {/each}
  </tbody>
</table>
<p class="hidden text-black">p</p>
