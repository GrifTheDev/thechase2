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

  let randomName = `How about ${randomProjectName()}?`;
  let questionSetName = $state("");

  let maxQuestionAmount = 500
  let requiredQuestionAmount = 30
  let recommendedQuestionAmount = 80
  let questionsAdded = $state(0)

  function dialogOpen() {
    if (browser) {
      const dialog = document.querySelector("dialog");
      dialog?.showModal()
    }
  }

  function dialogClose() {
    if (browser) {
      const dialog = document.querySelector("dialog");
      dialog?.close()
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

<div class="w-[25%] h-6 bg-red-400 rounded-sm flex flex-row bg-opacity-50 relative">
  <progress value="100" max="100" class="progress-filled:bg-red-700 bg-transparent w-1/6"> 32% </progress>
  <span class="h-8 w-[2px] rounded-md bg-white"><p class="translate-y-7 text-white">Minimum</p></span>
  <progress value="0" max="100" class="progress-filled:bg-green-400 bg-transparent w-1/3"> 32% </progress>
  <span class="h-8 w-[2px] rounded-md bg-white"><p class="translate-y-7 text-white">Recommended</p></span>
  <progress value="0" max="100" class="progress-filled:bg-slate-500 bg-transparent w-1/2"> 32% </progress>
  <span class="absolute right-0 h-8 w-[2px] rounded-md bg-white"><p class="translate-y-7 text-white">Maximum</p></span>
</div>


<div class="w-100% h-4"></div>

<PurpleFillButton textSize="md" label="+ Add Question" clickAction={dialogOpen}></PurpleFillButton>
<dialog class="bg-transparent overflow-hidden w-[100%] h-[100%] open:animate-modalSpawn">
  <div class="w-screen h-screen flex justify-center space-y-3 items-center">
    <div class="bg-slate-500 w-1/2 h-1/2 p-4 flex flex-col justify-center space-y-3 items-center">
      <Heading0 label="This is a test"/>

      <BlueButton label="Exit" textSize="md" clickAction={dialogClose}/>
    </div>
  </div>
</dialog>


<BlueButton textSize="md" label="Continue" disabledState={questionSetName == ""}
></BlueButton>

