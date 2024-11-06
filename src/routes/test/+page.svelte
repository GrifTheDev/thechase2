<script lang="ts">
  import { readDocData, readUsersData, updateUsersData } from "$lib/database/database";
  import { getDB } from "$lib/database/initialize_firebase";
  import { collection, CollectionReference, query, where, getDocs } from "firebase/firestore";
  //import jwt from "jsonwebtoken";

  let content = $state("a")

  async function HandleDAPress() {
    //const userInfo = jwt.verify("asd", "asdsadasd")
    const { db } = getDB();
    const cRef = collection(db, "users")
    const q = query(cRef, where("access_token", "==", ""))

    const querySnapshot = await getDocs(q)
    console.log(querySnapshot.docs[0].data())
    content = JSON.stringify(querySnapshot.docs[0].data())
    /* console.log(querySnapshot.size)
    querySnapshot.forEach((doc) => {
      content = JSON.stringify(doc.data());
    }) */
  }

  
</script>

<p class="text-3xl text-red-300">{JSON.stringify(content)}</p>

<button onclick={HandleDAPress}>Press me!</button>
