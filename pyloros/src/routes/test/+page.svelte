<script lang="ts">
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";
  import { WebSocketMessage } from "$lib/types/websocket/websocket_msg_types";

  let ws: WebSocket
  function connectToWS() {
    ws = new WebSocket('ws://localhost:8080')
  
    ws.onopen = () => {
      console.log("Listening to ws")
    }

    ws.onmessage = event => {
      console.log(`msg ${event.data}`)
    }

    ws.onclose = () => {
      console.log("closed")
    }

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };
  }

  function sendMsg() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      /* ws.send(JSON.stringify({type: "hello", message: "new"})) */
      // bFCE7R5CDNeJe1xuq7e2IAU52geN3sGf
      // ws.send(JSON.stringify({clientID: "bFCE7R5CDNeJe1xuq7e2IAU52geN3sGf", type: WebSocketMessage.CREDENTIALS, data: {gameCode: "776281", auth_token: "sometoken"}}))
      ws.send(JSON.stringify({clientID: "bFCE7R5CDNeJe1xuq7e2IAU52geN3sGf", type: WebSocketMessage.CREDENTIALS, data: {gameID: "398240", authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVvIiwicGVybWlzc2lvbnMiOnsicXVlc3Rpb25fc2V0cyI6eyJkb2NzIjpbInNoNnlzQ3U5ODNjc2Z1bUhreTBzWEJIUTc5S0YwQnBUIiwiaFhuVktGaFJrUk9SVVgzVXpOUHoyQzhYYStsblJPdSIsIklXeUhvMENHRlF0Rkt5TUVkdFVGZmh3R2EyZXFDdyIsIm1FbGRudFRIQlRnWHdHVkVnTGU1d2l3VElteWRQQVUiXSwiYWNjZXNzIjoicmVhZHdyaXRlIn19LCJzYWx0IjoiMmxUeThyVVZTK1pYYjYrZ20vMjNFZz09IiwiaWF0IjoxNzM4ODU4NDA3LCJleHAiOjE3Mzg4NTg3MDd9.x8-ZFuaSZH3fL3Xft20INtpirusPvgsoYXtw-upegrg"}}))
    
    }
  }
</script>

<p class="text-3xl text-red-300">a</p>
<DefaultButton label="Start Connect" textSize="sm" clickAction={connectToWS} />
<DefaultButton label="Message" textSize="sm" clickAction={sendMsg} />