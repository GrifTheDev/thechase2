<script lang="ts">
  import Heading1 from "$lib/components/headings/Heading1.svelte";
  import { onSnapshot, doc, type Unsubscribe } from "firebase/firestore";
  import type { DBGameType } from "$lib/types/database/games";
  import { getDB } from "$lib/database/initialize_firebase";
  const { db } = getDB();

  let gamesDocLive: DBGameType = $state({
    game: {
      id: "",
      state: 0,
    },
    question_set_id: "",
    player_teams: [],
    hunter: {
      id: "",
      display_name: "",
      hunt: {
        board_steps: 0,
        selected_answer: "A",
        win: false,
      },
      final_hunt: {
        lane_steps: 0,
        stopped: 0,
        win: false,
      },
    },
  });
  let gamesDocLiveUnsub: Unsubscribe = onSnapshot(
    doc(db, "games", "398240"),
    (doc) => {
      gamesDocLive = doc.data() as DBGameType;
    }
  );

</script>

<p class="text-white">{JSON.stringify(gamesDocLive)}</p>
<Heading1 label="Players Joined" />

  {#each gamesDocLive.player_teams as player}
  <div class="w-1/6 h-10 bg-white rounded-md text-center text-2xl flex flex-col items-center justify-center">
    <p class="text-black font-bold">{player.display_name}</p>
  </div>
  {/each}




