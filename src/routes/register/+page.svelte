<!--TODO: THIS MUST BE MADE INTO REUSABLE COMPONENTS AFTER THE DESIGN IS COMPLETE-->

<script lang="ts">
   import type { ActionData } from "./$types";

    export let form: ActionData
</script>

<div class="h-screen flex flex-col items-center justify-center bg-green-100">
        <form class="rounded-lg border-black border-2 w-1/3 h-2/3 flex flex-col items-center justify-center bg-blue-100" method="POST">
            <h1 class="text-5xl font-bold m-3 text-center">Become a user!</h1>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin">Name</p>
                <input class="border border-gray-900 rounded-sm p-1 w-3/5 text-lg" name="name" type="text">
            </label>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin">Surname</p>
                <input class="border border-gray-900 rounded-sm p-1 w-3/5 text-lg" name="surname" type="text">
            </label>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin">Email</p>
                <input class="border border-gray-900 rounded-sm p-1 w-3/5 text-lg" name="email" type="email">
            </label>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin">Password</p>
                <input class="border border-gray-900 rounded-sm p-1 w-3/5 text-lg" name="password" type="password">
            </label>
            <button class="text-xl font-bold border rounded-md border-black p-2 m-5 w-2/5">Register</button>
            <p>{form?.message}</p>
        </form>
        
</div>