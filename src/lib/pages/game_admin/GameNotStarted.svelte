<script lang="ts">
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  import { goto } from "$app/navigation";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import BlueFillButton from "$lib/components/buttons/BlueFillButton.svelte";
  import type { ServerResponseType } from "$lib/types/misc/server_response";
  import { gameState } from "$lib/states/game_state.svelte";
  import { GameState } from "$lib/types/game/game_state_enum";

  const {
    questionSetObject,
  }: {
    questionSetObject: (QuestionSetType & { id: string }) | undefined;
  } = $props();

  async function makeGameStartCall() {
    const req = await fetch("/api/game/start", {
      method: "POST",
      body: JSON.stringify({ qSetID: questionSetObject!.id }),
    });

    const res: ServerResponseType = await req.json();
    if (res.code == 200) {
        gameState.state = GameState.PLAYERS_JOINING
        localStorage.setItem("GProps", JSON.stringify({gID: res.data.gameID, state: GameState.PLAYERS_JOINING}))
    }
  }
</script>

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
      >. This question set contains
      <b
        >{questionSetObject.questions_open.length +
          questionSetObject.questions_three.length} questions</b
      >, out of which <b>{questionSetObject.questions_three.length}</b> are
      <b>multiple choice questions</b> and
      <b>{questionSetObject.questions_open.length}</b>
      are
      <b>open answer questions</b>.
    </p>
  </div>

  <BlueFillButton
    label="Start Game"
    textSize="sm"
    clickAction={makeGameStartCall}
  />
{/if}
