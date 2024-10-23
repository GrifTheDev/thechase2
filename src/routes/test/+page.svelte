<script lang="ts">
  import { readDocData, readUsersData } from "$lib/database/database";


  let content = $state("a")

  async function HandleDAPress() {
    //const a = await readUsersData("id");
    content = "aaaa"
  }

  
</script>

<p class="text-3xl text-red-300">{content}</p>

<button onclick={HandleDAPress}>Press me!</button>
