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
    import { browser } from "$app/environment";
  
    let randomName = `How about ${randomProjectName()}?`;
    let questionSetName = $state("");
    let notice = $state({type: "", message: ""}) // TODO type this in case I end up using it more throughout.
  
   
  </script>
  
  <div class="flex flex-row justify-center items-center space-x-1">
    <p
      class="font-bold text-2xl text-white rounded-full border-[2px] border-white flex items-center justify-center p-5 w-14 h-14"
    >
      4
    </p>
    <Heading1 label="Final Step" />
  </div>
  <DefaultParagraph
    label="Look through the data you have inputed for this question set. After completing this step you will be able to use the question set to start a game."
  />
  
  <BlueButton textSize="md" label="Continue" disabledState={true}  ></BlueButton>
  