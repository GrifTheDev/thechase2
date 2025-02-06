<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import Heading0 from '$lib/components/headings/Heading0.svelte';
  import { PUBLIC_VERSION } from '$env/static/public';
  let { data, children }: { data: LayoutData, children: Snippet } = $props();
  </script>

{#if !data.endpoint?.startsWith("/app/game/player")}
<nav class="w-auto p-4 bg-nav-bg flex flex-row items-center justify-between border-b border-white">
    <div class="w-auto flex flex-row space-x-1">
        <Heading0 label="out:run"/>
        <p class="text-white">v{PUBLIC_VERSION} (DEV)</p>
    </div>
    <div class="w-auto p-4 flex flex-row justify-between space-x-4">
        <a class="text-xl text-{data.selected[0] == 1 ? "blue-400" : "white"}" href="/app/dashboard">Dashboard</a>
        <!--!!Check why and how href is not hitting the middleware without refresh-->
        <a class="text-xl text-{data.selected[1] == 1 ? "blue-400" : "white"}" href="/app/questions">Question sets</a>
        <!--TODO Make it say "Name of user" instead of "Your account" (require chopping off the name if it is too long)-->
        <a class="text-xl text-{data.selected[2] == 1 ? "blue-400" : "white"}" href="/app/account">Your account</a>
    </div>
</nav>

<!--* CREDIT: https://stackoverflow.com/a/70912477-->
<!--* When tailwind loads it scans all files and only generates the classes used.-->
<!--* Since I am dynamically deciding the classes for each navbar item tailwind does not generate them.-->
<!--* This is why the hidden paragraph with the desired class exists.-->
<p class="hidden text-blue-400">a</p>
{/if}

{@render children?.()}