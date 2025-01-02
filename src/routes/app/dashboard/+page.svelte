<script lang="ts">
  import { goto } from "$app/navigation";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import GreenButton from "$lib/components/buttons/GreenButton.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import Heading2 from "$lib/components/headings/Heading2.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  let { data }: { data: { serverData: { data: Array<QuestionSetType & {id: string}>} } } =
    $props();

  async function sendToEdit() {
    localStorage.setItem("QSCP", JSON.stringify(Object.assign(data.serverData.data[0], {id: data.serverData.data[0].id})))
    await goto("/app/questions/create")
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
      <p class="hidden border-yellow-500">a</p>
      <div
        class="border border-{data.serverData.data[0].progress < 5
          ? 'yellow-500'
          : 'white'} rounded-md p-5 text-left"
      >
        <Heading2 label={data.serverData.data[0].title} />
        {#if data.serverData.data[0].progress < 5}
          <p class="text-yellow-500 pb-1">
            This question set has not been finished and cannot be used to start
            a game!
          </p>
        {/if}
        <p class="text-gray-400 italic">
          Multiple answer questions: {data.serverData.data[0].questions_three
            .length}
        </p>
        <p class="text-gray-400 italic">
          Open answer questions: {data.serverData.data[0].questions_open.length}
        </p>
        <div class="pt-3 flex flex-row space-x-2">
        <GreenButton label="Play" textSize="sm" disabledState={data.serverData.data[0].progress < 5} />
        <BlueButton label="Continue Editing" textSize="sm" clickAction={sendToEdit}/>
        </div>
      </div>
    {/if}
  </div>
</div>
