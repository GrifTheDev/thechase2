<script lang="ts">
  import { readDocData, readUsersData, updateUsersData } from "$lib/database/database";


  let content = $state("a")

  async function HandleDAPress() {
    const aa = await updateUsersData("31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66", {name:"Teo"})
    const a = await readUsersData("31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66");
    //console.log(a)
    content = JSON.stringify(a)
  }

  
</script>

<p class="text-3xl text-red-300">{content}</p>

<button onclick={HandleDAPress}>Press me!</button>
