<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import { onSnapshot, doc, type Unsubscribe } from "firebase/firestore";
  import type { DBGameType } from "$lib/types/database/games";
  import { getDB } from "$lib/database/initialize_firebase";
  const { db } = getDB();



</script>
<!-- 
<p class="text-white">{JSON.stringify(gamesDocLive)}</p> -->
<Heading1 label="Players Joined" />

<!--   {#each gamesDocLive.player_teams as player}
  <div class="w-1/6 h-10 bg-white rounded-md text-center text-2xl flex flex-col items-center justify-center">
    <p class="text-black font-bold">{player.display_name}</p>
  </div>
  {/each}
 -->



