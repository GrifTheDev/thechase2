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
    2
  </p>
  <Heading1 label="Questions - Three Answers" />
</div>
<DefaultParagraph
  label="Now's the time to add some questions! Please follow the amount guide below."
/>

<div
  class="w-[25%] h-6 bg-red-400 rounded-sm flex flex-row bg-opacity-50 relative"
>
  <progress
    value={(questionsToSave.length + localStorageQuestions.length).toString()}
    max="30"
    class="progress-filled:bg-red-700 bg-transparent w-1/6"
  >
    32%
  </progress>
  <span class="h-8 w-[2px] rounded-md bg-white"
    ><p class="translate-y-7 text-white">Minimum</p></span
  >
  <progress
    value={(
      questionsToSave.length +
      localStorageQuestions.length -
      30
    ).toString()}
    max="70"
    class="progress-filled:bg-green-400 bg-transparent w-1/3"
  >
    32%
  </progress>
  <span class="h-8 w-[2px] rounded-md bg-white"
    ><p class="translate-y-7 text-white">Recommended</p></span
  >
  <progress
    value={(
      questionsToSave.length +
      localStorageQuestions.length -
      100
    ).toString()}
    max="500"
    class="progress-filled:bg-slate-500 bg-transparent w-1/2"
  >
    32%
  </progress>
  <span class="absolute right-0 h-8 w-[2px] rounded-md bg-white"
    ><p class="translate-y-7 text-white">Maximum</p></span
  >
</div>

<div class="w-100% h-4"></div>

<PurpleFillButton textSize="md" label="+ Add Question" clickAction={dialogOpen}
></PurpleFillButton>

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
        class="rounded-lg w-100% pl-2 pr-11 pb-0 text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none"
        placeholder="Time for you to write a question. Make it a good one!"
        bind:value={currentInputQuestions.label}
      ></textarea>

      <p class="text-white font-light">Answers</p>
      <div class="flex flex-row justify-center space-x-3">
        <div class="flex flex-col justify-center space-y-3">
          <div class="relative">
            <p
              class="absolute top-1/2 -translate-y-1/2 transform right-3 text-white shadow-lg"
            >
              {answerLengths[0]}
            </p>
            <input
              class="static rounded-[3px] h-10 pl-2 pr-9 text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none"
              type="text"
              placeholder="Answer A"
              maxlength="30"
              bind:value={currentInputQuestions.answerA}
            />
          </div>
          <button
            onclick={() => {
              currentInputQuestions.correctAnswer = "A";
            }}
            class="h-10 border-white border rounded-[3px] text-center font-thin transition-colors {currentInputQuestions.correctAnswer ==
            'A'
              ? 'bg-white text-black font-normal'
              : currentInputQuestions.correctAnswer == ''
                ? 'text-white bg-transparent'
                : 'opacity-50 text-white'} bg-transparent active:bg-white active:text-black"
          >
            {currentInputQuestions.correctAnswer == "A"
              ? "Correct Answer"
              : "Mark as Correct Answer"}
          </button>
        </div>

        <div class="flex flex-col justify-center space-y-3">
          <div class="relative">
            <p
              class="absolute top-1/2 -translate-y-1/2 transform right-3 text-white shadow-lg"
            >
              {answerLengths[1]}
            </p>
            <input
              class="static rounded-[3px] h-10 pl-2 pr-9 text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none"
              type="text"
              placeholder="Answer B"
              maxlength="30"
              bind:value={currentInputQuestions.answerB}
            />
          </div>
          <button
            onclick={() => {
              currentInputQuestions.correctAnswer = "B";
            }}
            class="h-10 border-white border rounded-[3px] text-center font-thin transition-colors {currentInputQuestions.correctAnswer ==
            'B'
              ? 'bg-white text-black font-normal'
              : currentInputQuestions.correctAnswer == ''
                ? 'text-white bg-transparent'
                : 'opacity-50 text-white'} bg-transparent active:bg-white active:text-black"
          >
            {currentInputQuestions.correctAnswer == "B"
              ? "Correct Answer"
              : "Mark as Correct Answer"}
          </button>
        </div>

        <div class="flex flex-col justify-center space-y-3">
          <div class="relative">
            <p
              class="absolute top-1/2 -translate-y-1/2 transform right-3 text-white shadow-lg"
            >
              {answerLengths[2]}
            </p>
            <input
              class="static rounded-[3px] h-10 pl-2 pr-9 text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none"
              type="text"
              placeholder="Answer C"
              maxlength="30"
              bind:value={currentInputQuestions.answerC}
            />
          </div>
          <button
            onclick={() => {
              currentInputQuestions.correctAnswer = "C";
            }}
            class="h-10 border-white border rounded-[3px] text-center font-thin transition-colors {currentInputQuestions.correctAnswer ==
            'C'
              ? 'bg-white text-black font-normal'
              : currentInputQuestions.correctAnswer == ''
                ? 'text-white bg-transparent'
                : 'opacity-50 text-white'} bg-transparent active:bg-white active:text-black"
          >
            {currentInputQuestions.correctAnswer == "C"
              ? "Correct Answer"
              : "Mark as Correct Answer"}
          </button>
        </div>
      </div>

      <p class="text-white">{JSON.stringify(currentInputQuestions)}</p>

      <div class="flex flex-grow"></div>
      <div class="flex flex-row space-x-1 m-auto">
        <BlueButton
          label="Add Question"
          textSize="md"
          clickAction={submitNewQuestionToSet}
          disabledState={Object.values(currentInputQuestions).includes("")}
        />
        <RedButton label="Exit" textSize="md" clickAction={dialogClose} />
      </div>
    </div>
  </div>
</dialog>

<table class="w-full text-white text-center font-regular">
  <thead class="bg-gray-900 font-light text-md">
    <tr>
      <th class="py-2">
        Question {questionsToSave.length > 0
          ? `(You have ${questionsToSave.length} unsaved question${questionsToSave.length == 1 ? "" : "s"}!)`
          : ""}
      </th>
      <th class="py-2"> Answer A </th>
      <th class="py-2"> Answer B </th>
      <th class="py-2"> Answer C </th>
      <th class="py-2"> Correct Answer </th>
    </tr>
  </thead>
  <tbody class="text-md">
    {#each questionsToSave as q, i}
      <tr class="bg-red-400 bg-opacity-75 border-b border-gray-700">
        <td class="py-2 px-2 break-all">
          {q.label}
        </td>
        <td class="py-2 px-2 break-all">{q.answerA}</td>
        <td class="py-2 px-2 break-all">{q.answerB}</td>
        <td class="py-2 px-2 break-all">{q.answerC}</td>
        <td class="py-2 px-2 break-all">{q.correctAnswer}</td>
      </tr>
    {/each}

    {#each localStorageQuestions as l, i}
      <tr class="bg-gray-800 border-b border-gray-700">
        <td class="py-2 px-2 break-all">
          {l.label}
        </td>
        <td class="py-2 px-2 break-all">{l.answerA}</td>
        <td class="py-2 px-2 break-all">{l.answerB}</td>
        <td class="py-2 px-2 break-all">{l.answerC}</td>
        <td class="py-2 px-2 break-all">{l.correctAnswer}</td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="flex flex-row space-x-3 items-center justify-center">
  <BlueButton textSize="md" label="Continue" disabledState={true}></BlueButton>
  <GreenButton
    title={questionsToSave.length > 0 ? "You have changes to save!" : ""}
    textSize="md"
    clickAction={submitSavedQuestionsToSet}
    label="Save"
    disabledState={questionsToSave.length == 0}
  ></GreenButton>
</div>
<p class="hidden text-black">p</p>
