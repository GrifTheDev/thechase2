<!--TODO: THIS MUST BE MADE INTO REUSABLE COMPONENTS AFTER THE DESIGN IS COMPLETE-->
<!--TODO: Make boxes turn red when incorrect and retain inputted information-->

<script lang="ts">
   import type { ActionData } from "./$types";

   let showPswd = $state(false)

   let pswdType = $derived(showPswd ? "text" : "password")

   let { form } = $props() 
    
</script>

<div class="h-screen flex flex-col items-center justify-center bg-nav-bg">
        <form class="rounded-lg border-white border-2 w-2/5 h-4/5 flex flex-col items-center justify-center bg-dashboard-bg" method="POST">
            <h1 class="text-5xl font-bold m-3 text-center text-white">Become a user!</h1>
            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Name</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="name" type="text">
            </label>

            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Surname</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="surname" type="text">
            </label>

            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Email</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="email" type="email">
            </label>

            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Password</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="password" type={pswdType}>
            </label>

            <label class="w-full flex flex-col items-center justify-center">
                <p class="text-xl font-thin text-white">Confirm Password</p>
                <input class="static rounded-[3px] w-72 h-10 pl-2 pr-2 text-center text-lg text-white font-light border-2 border-gray-400 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" name="confirmPswd" type={pswdType}>
            </label>

            <label class="w-full flex flex-row items-center justify-center mt-3">
                <input type="checkbox" onclick={() => (showPswd = !showPswd)} /> 
                <p class="text-lg font-thin ml-1 text-white">Show Password</p>
            </label>

            <p class="w-full text-center  text-white pb-2">Want to <a class="text-blue-600 font-bold underline" href="/login">login</a> instead?</p>

            
            <button class="text-white text-center text-lg border-[3px] bg-transparent border-white rounded-md py-2 px-6 transition ease-in-out duration-200 disabled:opacity-50 disabled:border-gray-400 enabled:hover:scale-105 enabled:hover:shadow-whiteGlowPlus enabled:hover:-rotate-1 rotate enabled:active:scale-95 enabled:active:rotate-1 enabled:active:shadow-none">Register</button>
            <p class="text-red-500 pt-2">{form?.message}</p>
        </form>
        
</div>