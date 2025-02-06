<script lang="ts">
  import { browser } from "$app/environment";
  import PlayerJoinGame from "$lib/pages/player/PlayerJoinGame.svelte";
  import { gameState } from "$lib/states/game_state.svelte";
  import { GameState } from "$lib/types/game/game_state_enum";
  if (browser) {

    const playerData: {teamID: string, gameCode: string, state: number} = JSON.parse(
      // @ts-ignore
      localStorage.getItem("PlayerData") 
    ) || undefined;


    if (playerData != undefined) {
      let key = GameState[playerData.state]
      gameState.state = GameState[key as keyof typeof GameState]    
    }
  }
</script>
{#if gameState.state == GameState.GAME_NOT_STARTED}
  <PlayerJoinGame />
{:else if gameState.state == GameState.PLAYERS_JOINING}
<p class="text-white">we are cooking with gas</p>
{/if}
