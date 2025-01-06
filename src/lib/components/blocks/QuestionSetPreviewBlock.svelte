<script lang="ts">
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  import type { MouseEventHandler } from "svelte/elements";
  import Heading2 from "../headings/Heading2.svelte";
  import GreenButton from "../buttons/GreenButton.svelte";
  import BlueButton from "../buttons/BlueButton.svelte";
  import { goto } from "$app/navigation";
  import DefaultButton from "../buttons/DefaultButton.svelte";

  const {
    questionSetData,
  }: {
    questionSetData: QuestionSetType & { id: string };
  } = $props();

  const progressDesc = [
    "Title",
    "Question Three Creation",
    "Open Question Creation",
    "Finalize",
  ];

  async function sendToEdit() {
    localStorage.setItem("QSCP", JSON.stringify(questionSetData));
    await goto("/app/questions/create");
  }
</script>

<div
  class="shrink-0 w-[450px] {questionSetData.progress < 5 ? "bg-yellow-500" : "bg-white"} bg-opacity-10 border border-{questionSetData.progress < 5
    ? 'yellow-500'
    : 'white'} rounded-md p-5 text-left flex flex-col"
>
  <p class="hidden border-yellow-500 bg-yellow-500">a</p>
  <Heading2 label={questionSetData.title} />
  {#if questionSetData.progress < 5}
    <p class="text-yellow-500 pb-1 break-words">
      This question set has not been finished and cannot be used to start a
      game!
    </p>
  {:else}
    <p class="text-white pb-1 break-words">
      This question set is finished and can be used in a game. Press play to
      begin!
    </p>
  {/if}
  <p class="text-gray-400 italic">
    Multiple answer questions: {questionSetData.questions_three.length}
  </p>
  <p class="text-gray-400 italic">
    Open answer questions: {questionSetData.questions_open.length}
  </p>
  {#if questionSetData.progress == 5}
    <p class="text-gray-400 italic">
      Times played: 0
    </p>
  {/if}
  
  {#if questionSetData.progress < 5}
    <p class="text-gray-400 italic pb-1">
      Progress: {questionSetData.progress}/4 ({progressDesc[
        questionSetData.progress - 1
      ]})
    </p>
    <progress
      value={questionSetData.progress}
      max="4"
      class="h-4 bg-transparent border border-white rounded-md progress-filled:bg-white"
    ></progress>
  {/if}
  <div class="flex flex-grow"></div>
  <div class="pt-2 flex flex-row space-x-2">
    <DefaultButton
      label="Play"
      textSize="sm"
      disabledState={questionSetData.progress < 5}
    />
    {#if questionSetData.progress < 5}
      <DefaultButton
        label="Continue Editing"
        textSize="sm"
        clickAction={sendToEdit}
      />
    {:else}
    <BlueButton
      label="Statistics"
      textSize="sm"
      disabledState={questionSetData.progress < 5}
    />
    {/if}
  </div>
</div>
