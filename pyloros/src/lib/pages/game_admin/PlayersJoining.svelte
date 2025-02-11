<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import { onSnapshot, doc, type Unsubscribe } from "firebase/firestore";
  import type { DBGameType } from "$lib/types/database/games";
  import { getDB } from "$lib/database/initialize_firebase";
  const { db } = getDB();

  const {
    playerDataObject
  }: {
    playerDataObject: Array<{id: string, displayName: string, type: "HUNTER" | "PLAYER"}>
  } = $props();

</script>
<!-- 
<p class="text-white">{JSON.stringify(gamesDocLive)}</p> -->
<Heading1 label="Players Joined" />

{#each playerDataObject as player}
  <div class="w-1/6 h-10 bg-white rounded-md text-center text-2xl flex flex-col items-center justify-center">
    <p class="text-black font-bold">{player.displayName}</p>
  </div>
{/each}



