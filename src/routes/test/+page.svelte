<script lang="ts">
  import { readDocData, readUsersData, updateUsersData } from "$lib/database/database";
  //import jwt from "jsonwebtoken";

  let content = $state("a")

  async function HandleDAPress() {
    //const userInfo = jwt.verify("asd", "asdsadasd")

    //@ts-ignore
    content = userInfo
  }

  
</script>

<p class="text-3xl text-red-300">{content}</p>

<button onclick={HandleDAPress}>Press me!</button>
