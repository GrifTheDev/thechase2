<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import { randomProjectName } from "$lib/utils/random_project_name_gen";
  import Fa from "svelte-fa";
  import { faDice } from "@fortawesome/free-solid-svg-icons";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import { qSetCreation } from "$lib/states/question_set_creation.svelte"
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  import type { ServerResponseType } from "$lib/types/misc/server_response";

  let randomName = `How about ${randomProjectName()}?`;
  let questionSetName = $state("");
  let notice = $state({type: "", message: ""}) // TODO type this in case I end up using it more throughout.

  async function createQSAndAdvance() {
    let questionSetCreationDataObject: QuestionSetType = {
      title: questionSetName,
      meetsCriteria: false,
      questions_open: [],
      questions_three: []
    }
    const res = await fetch("/api/question_sets/create", {
      method: "POST",
      body: JSON.stringify(questionSetCreationDataObject)
    })

    const data: ServerResponseType = await res.json()
    if (data.code == 403) {
      notice.type = "err"
      notice.message = `[${data.code}] ${data.message}`
    } else {
      qSetCreation.progress = 2
    }

    
  }
</script>

<div class="flex flex-row justify-center items-center space-x-1">
  <p
    class="font-bold text-2xl text-white rounded-full border-[2px] border-white flex items-center justify-center p-5 w-14 h-14"
  >
    1
  </p>
  <Heading1 label="Title" />
</div>
<DefaultParagraph
  label="Add a title so you can easily identify different question sets from the dashboard."
/>
<div class="relative">
  <div
    class=""
    onclick={() => {
      questionSetName = randomProjectName();
    }}
    onkeydown={() => {
      questionSetName = randomProjectName();
    }}
    tabindex="0"
    role="button"
  >
    <Fa
      class="absolute top-1/2 transform -translate-y-1/2 right-3 transition-all hover:scale-110 active:scale-90"
      icon={faDice}
      color="#FFFFFF"
      size="lg"
    />
  </div>
  <input
    class="static rounded-[3px] w-96 h-10 pl-2 pr-11 text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none"
    type="text"
    placeholder={randomName}
    bind:value={questionSetName}
  />

</div>
{#if notice.message != ""}
  <p class="text-center text-red-400">{notice.message}</p>
{/if}

<BlueButton textSize="md" label="Continue" disabledState={questionSetName == ""} clickAction={createQSAndAdvance} ></BlueButton>
