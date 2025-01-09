<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import { onSnapshot, doc } from "firebase/firestore"
  import type { DBGameType } from "$lib/types/database/games";
  import { getDB } from "$lib/database/initialize_firebase";
  import { gamesDBSubStore } from "$lib/database/subscriptions/games_subscription.svelte";
  const { db } = getDB();


  let gamesDocLive: void = gamesDBSubStore.startSub("376717")
</script>

<p class="text-white">{JSON.stringify(gamesDocLive)}</p>
<Heading1 label="HELfLO" />