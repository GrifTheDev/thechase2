<script lang="ts">
  import DefaultButton from "$lib/components/buttons/DefaultButton.svelte";

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
    ws.send("hello")
    
    }
  }
</script>

<p class="text-3xl text-red-300">a</p>
<DefaultButton label="Start Connect" textSize="sm" clickAction={connectToWS} />
<DefaultButton label="Message" textSize="sm" clickAction={sendMsg} />