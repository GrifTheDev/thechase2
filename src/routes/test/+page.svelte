<script lang="ts">
  import { readDocData, readUsersData } from "$lib/database/database";

  let content = "Hi!";

  async function HandleDAPress() {
    const a = await readUsersData("id");
  }

  export { content };
</script>

<p class="text-3xl">{content}</p>

<button on:click={HandleDAPress}>Press me!</button>
