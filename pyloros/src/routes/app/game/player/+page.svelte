<script lang="ts">
  import { browser } from "$app/environment";
  import { PUBLIC_THERON_SERVICE_URL } from "$env/static/public";
  import PlayerJoinGame from "$lib/pages/player/PlayerJoinGame.svelte";
  import { gameState } from "$lib/states/game_state.svelte";
  import { GameState } from "$lib/types/game/game_state_enum";
  import type { ServerResponseType } from "$lib/types/misc/server_response";
  import type { MessageResponseType } from "$lib/types/websocket/message_response_type";
  import { WebSocketMessage } from "$lib/types/websocket/websocket_msg_types";

  let {
    data,
  }: {
    data: { gameID: string; displayName: string };
  } = $props();

  let ws: WebSocket;
  if (browser) {
    ws = new WebSocket(PUBLIC_THERON_SERVICE_URL);
    ws.onmessage = async (event) => {
      const wsMessagePayload: MessageResponseType = JSON.parse(event.data);

      switch (wsMessagePayload.type) {
        case WebSocketMessage.CREDENTIALS_REQUEST: {
          const gameExists = localStorage.getItem("gameData");
          const clientID = wsMessagePayload.data.clientID;

          if (
            gameExists == null ||
            gameExists == undefined ||
            gameExists == "undefined"
          ) {
            ws.send(
              JSON.stringify({
                clientID: clientID,
                type: WebSocketMessage.CREDENTIALS,
                data: { gameID: data.gameID },
              })
            );
            localStorage.setItem(
              "gameData",
              JSON.stringify({ gameID: data.gameID, clientID: clientID, teamID: "" })
            );
          } else {
            ws.send(
              JSON.stringify({
                clientID: JSON.parse(gameExists).clientID,
                type: WebSocketMessage.CREDENTIALS,
                data: { gameID: JSON.parse(gameExists).gameID },
              })
            );
          }
        }

        case WebSocketMessage.CREDENTIALS_SUCCESS: {
          const storedData = localStorage.getItem("gameData");
          if (storedData != null) {
            const parsedData = JSON.parse(storedData)
            if (parsedData.teamID == "") {
                ws.send(
              JSON.stringify({
                clientID: parsedData.clientID,
                type: WebSocketMessage.CREATE_TEAM,
                data: { gameID: data.gameID, displayName: data.displayName },
              })
            );

            parsedData.teamID = parsedData.clientID

            localStorage.setItem("gameData", JSON.stringify(parsedData))
            }
            gameState.state = GameState.PLAYERS_JOINING;
            
          }
        }
      }
    };

    ws.onopen = () => {
      console.log("HELLO");
    };
  }
</script>

{#if gameState.state == GameState.GAME_NOT_STARTED}
  <PlayerJoinGame />
{:else if gameState.state == GameState.PLAYERS_JOINING}
  <p class="text-white text-center">You are part of the {data.displayName} team!</p>
{/if}
