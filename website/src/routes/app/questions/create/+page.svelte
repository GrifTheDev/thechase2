<script lang="ts">
  import { browser } from "$app/environment";
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import CreateQsOpenQuestions from "$lib/pages/question_set_create/CreateQSOpenQuestions.svelte";
  import CreateQsQuestions from "$lib/pages/question_set_create/CreateQSQuestions.svelte";
  import CreateQSTitle from "$lib/pages/question_set_create/CreateQSTitle.svelte";
  import FinalizeQsCreation from "$lib/pages/question_set_create/FinalizeQSCreation.svelte";
  import { qSetCreation } from "$lib/states/question_set_creation.svelte"
  import type { QuestionSetType } from "$lib/types/database/question_sets";

  let localStorageData: QuestionSetType
  if (browser) {
    // @ts-ignore
    // * JSON.parse(null) will return null which is exactly what I need, just can't find a way
    // * for TS to understand this.
    const questionSetCreationObject = JSON.parse(localStorage.getItem("QSCP")) as QuestionSetType
    localStorageData = questionSetCreationObject
    if (questionSetCreationObject != null) {
      qSetCreation.progress = questionSetCreationObject.progress
    } else {
      qSetCreation.progress = 1
    }
  }
  
</script>
<!-- {qSetCreation.progress} -->
<div class="w-screen h-screen bg-dashboard-bg">
  <div class="w-auto h-auto p-4 flex flex-col space-y-3 items-center">
    <Heading0 label={`Question Set Creation - ${localStorageData == undefined ? "New Question Set" : localStorageData.title}`}  />
    {#if qSetCreation.progress == 0}
      <p class="text-white font-light animate-spin">Loading...</p>
    {:else if qSetCreation.progress == 1}
      <CreateQSTitle/>
    {:else if qSetCreation.progress == 2}
      <CreateQsQuestions/>
    {:else if qSetCreation.progress == 3}
      <CreateQsOpenQuestions/>
    {:else if qSetCreation.progress == 4}
      <FinalizeQsCreation />
    {/if}
    
  </div>
</div>

