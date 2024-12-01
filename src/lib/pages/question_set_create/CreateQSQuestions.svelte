<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import { randomProjectName } from "$lib/utils/random_project_name_gen";
  import Fa from "svelte-fa";
  import { faDice } from "@fortawesome/free-solid-svg-icons";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";
  import PurpleFillButton from "$lib/components/buttons/PurpleFillButton.svelte";
  import { browser } from "$app/environment";

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
<div class="w-[25%] h-6 bg-red-400 rounded-sm flex flex-row space-x-0 relative">
  <!--increase each by 0.83 MAX 25-->
  <div class="w-[24.9%] h-6 bg-green-200 rounded-sm rounded-r-none">
  </div>

  <!--increase each by 0.3125 MAX 25-->
  <div class="w-[25%] h-6 bg-blue-200 rounded-none">

  </div>
  <!--increase each by 0.1 MAX 50-->
  <div class="w-[25%] h-6 bg-slate-200 rounded-sm rounded-l-none">

  </div>
  <span class="absolute h-8 w-[2px] rounded-md bg-white right-3/4"><p class="translate-y-7 text-white">Min</p></span>
  <span class="absolute h-8 w-[2px] rounded-md bg-white right-1/2"><p class="translate-y-7 text-white">Recommended</p></span>
  <span class="absolute h-8 w-[2px] rounded-md bg-white right-0"><p class="translate-y-7 text-white">Max</p></span>
</div>
<div class="w-100% h-4"></div>

<PurpleFillButton textSize="md" label="+ Add Question" clickAction={dialogOpen}></PurpleFillButton>

<dialog class="backdrop:backdrop-blur-sm justify-center transition-all duration-300 ease-in absolute h-auto w-1/2">
  <button onclick={dialogClose}>Close</button>
  <p>This modal dialog has a groovy backdrop!</p>
</dialog>


<BlueButton textSize="md" label="Continue" disabledState={questionSetName == ""}
></BlueButton>

