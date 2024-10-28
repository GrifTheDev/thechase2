<script lang="ts">
  import { readDocData, readUsersData, updateUsersData } from "$lib/database/database";

  let content = $state("a")

  async function HandleDAPress() {
    const email = "mail@teomilic.com"

    content = email
  }

  
</script>

<p class="text-3xl text-red-300">{content}</p>

<button onclick={HandleDAPress}>Press me!</button>
