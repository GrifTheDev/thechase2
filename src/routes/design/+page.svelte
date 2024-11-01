<!--TODO Put these into reusable components.-->

<script>
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
</script>

<div class="bg-dashboard-bg w-screen h-screen">
  <div class="p-6 flex flex-col space-y-4 items-start border-b border-white">
    <Heading0 label="The Hunt"/>
    <Heading1 label="Question sets"/>
    <DefaultParagraph label="You do not have any question sets yet. Add some?"/>
    <DefaultButton label="Lavender Haze" textSize="md" />
  </div>
</div>
