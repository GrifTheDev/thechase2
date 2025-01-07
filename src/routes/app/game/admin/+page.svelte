<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import BlueFillButton from "$lib/components/buttons/BlueFillButton.svelte";
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import type { QuestionSetType } from "$lib/types/database/question_sets";

  let questionSetObject: QuestionSetType;

  if (browser) {
    const questionSetObjectL: QuestionSetType = JSON.parse(
      // @ts-ignore
      localStorage.getItem("QSCP") 
    ) || undefined;
    questionSetObject = questionSetObjectL;
  }
</script>

<div class="flex flex-col space-y-2 items-center justify-center p-1">
  <Heading0 label="Game Admin Panel" />

  {#if questionSetObject == undefined}
    <div class="w-2/3 break-words text-center">
      <DefaultParagraph
        label="There exist two explanations as to how you arrived here. Either you decided to look around the site because you have nothing better to do with your sad existence, or I made a coding mistake (this never happens). In the name of efficiency, I'm just gonna be honest and say this is all your fault. However, in my unprecedented generosity I will grant you a way to fix what you have so carelessly broken. Simply click the button below and return to your meaningless little life, pressing buttons no one dares to press because they have better shit to do then breaking things someone spent hours making."
      />
      <div class="h-2"></div>
      <DefaultButton
        label="Get the fuck out."
        textSize="sm"
        clickAction={() => {
          goto("/app/dashboard");
        }}
      />
    </div>
  {:else}
    <Heading1 label="You are about to start a game." />
    <div class="w-2/3 break-words">
    <p class="text-white text-lg text-center">
      The game will be using the question set labeled: <b
        ><i>{questionSetObject.title}</i></b
      >.
      This question set contains
      <b
        >{questionSetObject.questions_open.length +
          questionSetObject.questions_three.length} questions</b
      >, out of which <b>{questionSetObject.questions_three.length}</b> are
      <b>multiple choice questions</b> and <b>{questionSetObject.questions_open.length}</b> are
      <b>open answer questions</b>.
    </p>
    </div>

    <BlueFillButton label="Start Game" textSize="sm" />
  {/if}
</div>
