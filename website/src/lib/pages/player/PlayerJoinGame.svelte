<script lang="ts">
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import Heading2 from "$lib/components/headings/Heading2.svelte";
  import { gameState } from "$lib/states/game_state.svelte";
  import { GameState } from "$lib/types/game/game_state_enum";
  import type { ServerResponseType } from "$lib/types/misc/server_response";

  let playerDataObject: { gameCode: string; displayName: string } = $state({
    gameCode: "",
    displayName: "",
  });

  let wrongServerRes = $state({
    message: "",
    serverMessage: ""
  })

  async function joinPlayerToGame() {
    const req = await fetch("/api/game/public/join_player", {
      method: "POST",
      body: JSON.stringify(playerDataObject),
    });

    const res: ServerResponseType = await req.json();
    if (res.code == 400) {
        wrongServerRes.serverMessage = res.message
        wrongServerRes.message = "The game code you have provided is invalid."
    } else if (res.code == 200) {
        localStorage.setItem("PlayerData", JSON.stringify({teamID: res.data.teamID, gameCode: res.data.gameCode, state: GameState.PLAYERS_JOINING}))
        gameState.state = GameState.PLAYERS_JOINING
    }
    
  }
</script>

<div
  class="flex flex-col space-y-2 items-center justify-center p-1 w-screen h-screen"
>
  <div
    class=" text-white text-center flex flex-col space-y-1 items-center justify-center"
  >
    <Heading2 label="out:run" />
    <Heading1 label="Join a game!" />

    <input
      class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      type="number"
      placeholder="Game Code"
      bind:value={playerDataObject.gameCode}
    />

    <input
      class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-b-2 border-gray-400 bg-transparent focus:outline-none"
      type="text"
      placeholder="Display Name"
      bind:value={playerDataObject.displayName}
    />
    <div class="w-screen h-[5px]"></div>

    {#if wrongServerRes.message != ""} 
        <p class="text-red-500 pb-2">{wrongServerRes.message}</p>
    {/if}

    <DefaultButton
      label="Join"
      textSize="md"
      disabledState={Object.values(playerDataObject).includes("")}
      clickAction={joinPlayerToGame}
    />
  </div>
</div>
