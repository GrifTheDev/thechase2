<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { PUBLIC_THERON_SERVICE_URL } from "$env/static/public";
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
  import type { MessageResponseType } from "$lib/types/websocket/message_response_type";
  import { WebSocketMessage } from "$lib/types/websocket/websocket_msg_types";

  let {
    data,
  }: {
    data: { qSetID: string; authToken: string };
  } = $props();

  let ws: WebSocket;
  let currentTeams: Array<{id: string, displayName: string, type: "HUNTER" | "PLAYER"}> = $state([])

  if (browser) {
    if (data.qSetID == undefined || data.authToken == undefined) {
      console.log(
        "[ERROR] Tried accessing the game admin panel with no auth data."
      );
      goto("/app/dashboard");
    }

    ws = new WebSocket(PUBLIC_THERON_SERVICE_URL);
    ws.onmessage = async (event) => {
      console.log(event.data)
      const wsMessagePayload: MessageResponseType = JSON.parse(event.data);
      
      switch (wsMessagePayload.type) {
        case WebSocketMessage.CREDENTIALS_REQUEST: {
          const gameExists = localStorage.getItem("gameData")
          const clientID = wsMessagePayload.data.clientID;

          if (gameExists == null || gameExists == undefined || gameExists == "undefined") {
            const req = await fetch("/api/game/start", {
            method: "POST",
            body: JSON.stringify({ qSetID: data.qSetID }),
          });

          const res: ServerResponseType = await req.json();
          if (res.code == 200) {
            ws.send(
              JSON.stringify({
                clientID: clientID,
                type: WebSocketMessage.CREDENTIALS,
                data: { gameID: res.data.gameID, authToken: data.authToken },
              })
            );
              
            localStorage.setItem("gameData", JSON.stringify({gameID: res.data.gameID, clientID: clientID }))
          }
          } else {
            ws.send(
              JSON.stringify({
                clientID: (JSON.parse(gameExists)).clientID,
                type: WebSocketMessage.CREDENTIALS,
                data: { gameID: (JSON.parse(gameExists)).gameID, authToken: data.authToken },
              })
            );
          }
        }

        case WebSocketMessage.CREDENTIALS_SUCCESS: {
          gameState.state = GameState.PLAYERS_JOINING;
        }

        case WebSocketMessage.GAME_TEAMS_UPDATE: {
          console.log(wsMessagePayload.data.displayName, wsMessagePayload.data.displayName != undefined)
          if (wsMessagePayload.data.displayName != undefined) {
            currentTeams.push({
            displayName: wsMessagePayload.data.displayName,
            id: wsMessagePayload.data.id,
            type: wsMessagePayload.data.type
          })
          }
          
        }
      }
    };

    ws.onopen = () => {
      console.log("HELLO");
    };
  }
</script>

<div class="flex flex-col space-y-2 items-center justify-center p-1">
  <Heading0 label="Game Admin Panel" />

  {#if gameState.state == GameState.GAME_NOT_STARTED}
    <p class="text-white">Loading...</p>
  {:else if gameState.state == GameState.PLAYERS_JOINING}
    <PlayersJoining playerDataObject={currentTeams} />
  {/if}
</div>
