<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import BlueFillButton from "$lib/components/buttons/BlueFillButton.svelte";
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import Heading0 from "$lib/components/headings/Heading0.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import DefaultParagraph from "$lib/components/paragraphs/DefaultParagraph.svelte";
  import GameNotStarted from "$lib/pages/game_admin/GameNotStarted.svelte";
  import PlayersJoining from "$lib/pages/game_admin/PlayersJoining.svelte";
  import { gameState } from "$lib/states/game_state.svelte";
  import type { QuestionSetType } from "$lib/types/database/question_sets";
  import { GameState } from "$lib/types/game/game_state_enum";
  import type { ServerResponseType } from "$lib/types/misc/server_response";

  // svelte-ignore non_reactive_update - I have no idea why this triggered but oh well
  let questionSetObject: QuestionSetType & {id: string};
  

  if (browser) {
    const questionSetObjectL: QuestionSetType & {id: string} = JSON.parse(
      // @ts-ignore
      localStorage.getItem("QSCP") 
    ) || undefined;
    questionSetObject = questionSetObjectL;

    const gameInfo: {gID: string, state: number} = JSON.parse(
      // @ts-ignore
      localStorage.getItem("GProps") 
    ) || undefined;

    if (questionSetObjectL == undefined) {
      goto("/app/game/player")
    }

    if (gameInfo != undefined) {
      let key = GameState[gameInfo.state]
      gameState.state = GameState[key as keyof typeof GameState]    
    }
  }
  
</script>

<div class="flex flex-col space-y-2 items-center justify-center p-1">
  <Heading0 label="Game Admin Panel" />
  {#if gameState.state == GameState.GAME_NOT_STARTED}
    <GameNotStarted questionSetObject={questionSetObject}/>
  {:else if gameState.state == GameState.PLAYERS_JOINING}
    <PlayersJoining />
  {/if}
  
</div>
