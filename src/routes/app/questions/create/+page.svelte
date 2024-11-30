<script lang="ts">
  import { browser } from "$app/environment";
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import CreateQsQuestions from "$lib/pages/question_set_create/CreateQSQuestions.svelte";
  import CreateQSTitle from "$lib/pages/question_set_create/CreateQSTitle.svelte";
  import { qSetCreation } from "$lib/states/question_set_creation.svelte"

</script>
<!-- {qSetCreation.progress} -->
<div class="w-screen h-screen bg-dashboard-bg">
  <div class="w-auto h-auto p-4 flex flex-col space-y-3 items-center">
    <Heading0 label="Question Set Creation" />
    {#if qSetCreation.progress == 1}
      <CreateQSTitle/>
    {:else if qSetCreation.progress == 2}
      <CreateQsQuestions/>
    {/if}
    
  </div>
</div>

