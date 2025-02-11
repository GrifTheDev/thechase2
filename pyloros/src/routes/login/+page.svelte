<!--TODO: THIS MUST BE MADE INTO REUSABLE COMPONENTS AFTER THE DESIGN IS COMPLETE-->

<script lang="ts">
   import type { ActionData } from "./$types";

    export let form: ActionData
</script>

<div class="h-screen flex flex-col items-center justify-center bg-nav-bg">
        <form class="rounded-lg border-white border-2 w-2/5 h-4/5 flex flex-col items-center justify-center bg-dashboard-bg" method="POST">
            <h1 class="text-5xl font-bold m-3 text-center text-white">Welcome back!</h1>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Email</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="email" type="email">
            </label>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Password</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="password" type="password">
            </label>

            <p class="w-full text-center mt-2 text-white pb-3">Want to <a class="text-blue-600 font-bold underline" href="/register">register</a> instead?</p>
            <button class="text-white text-center text-lg border-[3px] bg-transparent border-white rounded-md py-2 px-6 transition ease-in-out duration-200 disabled:opacity-50 disabled:border-gray-400 enabled:hover:scale-105 enabled:hover:shadow-whiteGlowPlus enabled:hover:-rotate-1 rotate enabled:active:scale-95 enabled:active:rotate-1 enabled:active:shadow-none">Login</button>
            <p class="text-red-500 pt-2">{form?.message}</p>
        </form>
        
</div>