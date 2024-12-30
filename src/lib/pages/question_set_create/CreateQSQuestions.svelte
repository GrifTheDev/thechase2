<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import { randomProjectName } from "$lib/utils/random_project_name_gen";
  import Fa from "svelte-fa";
  import { faDice } from "@fortawesome/free-solid-svg-icons";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import PurpleFillButton from "$lib/components/buttons/PurpleFillButton.svelte";
  import { browser } from "$app/environment";
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import RedButton from "$lib/components/buttons/RedButton.svelte";
  import type { QuestionObject } from "$lib/types/misc/question_object";
  import { PUBLIC_QUESTION_ANSWER_LENGTH } from "$env/static/public";

  let currentInputQuestions: QuestionObject = $state({
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
    value="100"
    max="100"
    class="progress-filled:bg-red-700 bg-transparent w-1/6"
  >
    32%
  </progress>
  <span class="h-8 w-[2px] rounded-md bg-white"
    ><p class="translate-y-7 text-white">Minimum</p></span
  >
  <progress
    value="0"
    max="100"
    class="progress-filled:bg-green-400 bg-transparent w-1/3"
  >
    32%
  </progress>
  <span class="h-8 w-[2px] rounded-md bg-white"
    ><p class="translate-y-7 text-white">Recommended</p></span
  >
  <progress
    value="0"
    max="100"
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

        <div class="relative">
          <p
            class="absolute top-1/2 transform -translate-y-1/2 right-3 text-white"
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

        <div class="relative">
          <p
            class="absolute top-1/2 transform -translate-y-1/2 right-3 text-white"
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
      </div>

      <div class="flex flex-col justify-center items-center pt-1a">
        <select
          class="h-10 w-1/3 bg-transparent border-white border rounded-[3px] text-white text-center font-thin bg-black"
          placeholder="There can only be one!"
          bind:value={currentInputQuestions.correctAnswer}
        >
          <option value="" class="text-gray-400 opacity-50" selected
            >Choose the correct answer</option
          >
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
        </select>
      </div>
      <p class="text-white">{JSON.stringify(currentInputQuestions)}</p>

      <div class="flex flex-grow"></div>
      <div class="flex flex-row space-x-1 m-auto">
        <DefaultButton
          label="Add Question"
          textSize="md"
          clickAction={dialogClose}
          disabledState={true}
        />
        <RedButton label="Exit" textSize="md" clickAction={dialogClose} />
      </div>
    </div>
  </div>
</dialog>

<BlueButton textSize="md" label="Continue" disabledState={true}></BlueButton>
