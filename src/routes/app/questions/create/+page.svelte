<script lang="ts">
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import { randomProjectName } from "$lib/utils/random_project_name_gen";
  import Fa from "svelte-fa";
  import { faDice } from "@fortawesome/free-solid-svg-icons";

  let randomName = `How about ${randomProjectName()}?`;
  let questionSetName = $state("")

</script>

<div class="w-screen h-screen bg-dashboard-bg">
  <div class="w-auto h-auto p-4 flex flex-col space-y-3 items-center">
    <Heading0 label="Question Set Creation" />
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
      <div class="" onclick={() => { questionSetName = randomProjectName() }} onkeydown={() => { questionSetName = randomProjectName() }} tabindex=0 role="button">
        <Fa class="absolute top-1/2 transform -translate-y-1/2 right-3 hover:scale-110 active:scale-90" icon={faDice} color="#FFFFFF" size="lg" />
      </div>
      <input
        class="static rounded-[3px] w-96 h-10 pl-2 pr-11 text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none"
        type="text"
        placeholder={randomName}
        bind:value={questionSetName}
      />
    </div>
    <!---->
    <button class="text-white text-center text-md border-[3px] bg-blue-600 border-blue-900 rounded-md py-2 px-6 animate-buttonQuestionSetUnHover enabled:animate-buttonQuestionSetCreateNext enabled:hover:animate-buttonQuestionSetHover enabled:active:animate-buttonQuestionSetActivate disabled:animate-buttonQuestionSetCreateRemove" disabled={questionSetName == ""}>Next</button>
  </div>
</div>
