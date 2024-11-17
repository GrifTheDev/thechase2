<script lang="ts">
  import Heading0 from "$lib/components/headings/Heading0.svelte";


  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";

</script>
<div class="w-screen h-screen bg-dashboard-bg">
    <div class="w-auto h-auto p-4 flex flex-col space-y-3 items-center">
      <Heading0 label="Question Set Creation"/> 
      <div class="flex flex-row justify-center items-center space-x-1">
        <p class="font-bold text-2xl text-black rounded-full bg-white flex items-center justify-center p-5 w-14 h-14">1</p>
        <Heading1 label="Title"/> 
        
        </div>
        <DefaultParagraph label="Add a title so you can easily identify different question sets from the dashboard."/>
    </div>
</div>
