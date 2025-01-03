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
      questionSetData: QuestionSetType & {id: string}
    } = $props();
    async function sendToEdit() {
    localStorage.setItem("QSCP", JSON.stringify(questionSetData))
    await goto("/app/questions/create")
  }
  </script>
  <p class="hidden border-yellow-500">a</p>
  <div
    class="border border-{questionSetData.progress < 5
      ? 'yellow-500'
      : 'white'} rounded-md p-5 text-left"
  >
    <Heading2 label={questionSetData.title} />
    {#if questionSetData.progress < 5}
      <p class="text-yellow-500 pb-1 break-words">
        This question set has not been finished and cannot be used to start
        a game!
      </p>
    {:else}
        <p class="text-white pb-1 break-words">
        This question set is finished and can be used in a game. Press play to begin!
      </p>
    {/if}
    <p class="text-gray-400 italic">
      Multiple answer questions: {questionSetData.questions_three
        .length}
    </p>
    <p class="text-gray-400 italic">
      Open answer questions: {questionSetData.questions_open.length}
    </p>
    <div class="pt-3 flex flex-row space-x-2">
    <GreenButton label="Play" textSize="sm" disabledState={questionSetData.progress < 5} />
    <DefaultButton label="Continue Editing" textSize="sm" clickAction={sendToEdit}/>
    </div>
  </div>