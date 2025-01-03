<script lang="ts">
  import { goto } from "$app/navigation";
  import QuestionSetPreviewBlock from "$lib/components/blocks/QuestionSetPreviewBlock.svelte";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import GreenButton from "$lib/components/buttons/GreenButton.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import Heading2 from "$lib/components/headings/Heading2.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  let {
    data,
  }: {
    data: { serverData: { data: Array<QuestionSetType & { id: string }> } };
  } = $props();

  async function createNewQuestionSet() {
    localStorage.removeItem("QSCP")
    await goto("/app/questions/create");
  }
</script>

<div class="w-screen h-screen bg-dashboard-bg">
  <div class="w-auto h-auto p-4 flex flex-col space-y-3 items-start">
    <Heading1 label="Question sets" />

    {#if data.serverData.data.length == 0}
      <DefaultParagraph
        label="You do not have any question sets yet. Add some?"
      />
      <DefaultButton
        label="Create Question Set"
        textSize="md"
        clickAction={() => {
          goto("/app/questions/create");
        }}
      />
    {:else}
      <div class="flex flex-row space-x-4 overflow-x-scroll overflow-y-hidden">
        {#each data.serverData.data as qSetData}
          <div class="shrink-0 w-[400px]">
            <QuestionSetPreviewBlock questionSetData={qSetData} />
          </div>
        {/each}
        <button
          class="w-60 shrink-0 flex flex-col space-y-2 border border-white rounded-md p-5 text-white text-center justify-center transition-all hover:scale-105 hover:bg-white hover:text-black hover:rounded-md active:scale-95"
          onclick={createNewQuestionSet}
          >
          <p class="text-5xl">+</p>
          <p>Create Question Set</p>
        </button>
      </div>
    {/if}
  </div>
</div>
