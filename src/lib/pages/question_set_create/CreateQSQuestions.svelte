<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import { randomProjectName } from "$lib/utils/random_project_name_gen";
  import Fa from "svelte-fa";
  import { faDice } from "@fortawesome/free-solid-svg-icons";
  import BlueButton from "$lib/components/buttons/BlueButton.svelte";

  let randomName = `How about ${randomProjectName()}?`;
  let questionSetName = $state("");

  let questionAmount = $state("50")
</script>

<div class="flex flex-row justify-center items-center space-x-1">
  <p
    class="font-bold text-2xl text-white rounded-full border-[2px] border-white flex items-center justify-center p-5 w-14 h-14"
  >
    2
  </p>
  <Heading1 label="Questions" />
</div>
<DefaultParagraph
  label="Now's the time to add some questions! Please follow the amount guide below."
/>
<div class="w-[25%] h-6 bg-red-400 rounded-md flex flex-row space-x-0">
  <div class="w-[20%] h-6 bg-green-200 rounded-md z-0">
  </div>
  <span class="h-8 w-[2px] rounded-md bg-white"><p class="translate-y-7 text-white">Minimum</p></span>
  <div class="w-[20%] h-6 bg-blue-200 rounded-md">

  </div>
  <span class="h-8 w-[2px] rounded-md bg-white"><p class="translate-y-7 text-white">Recommended</p></span>
  <div class="w-[59%] h-6 bg-slate-200 rounded-md z-0">

  </div>
  <span class="h-8 w-[2px] rounded-md bg-white"><p class="translate-y-7 text-white">Max</p></span>
</div>
<BlueButton textSize="md" label="Continue" disabledState={questionSetName == ""}
></BlueButton>
