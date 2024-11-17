<script lang="ts">
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  let { data } = $props();
</script>
<div class="w-screen h-screen bg-dashboard-bg">
    <div class="w-auto h-auto p-4 flex flex-col space-y-3 items-start ">
        <Heading1 label="Question sets"/>
        <DefaultParagraph label="You do not have any question sets yet. Add some?"/>
        <DefaultButton label="Create Question Set" textSize="md" />
      </div>
</div>
