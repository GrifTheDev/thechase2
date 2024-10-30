<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  let { data, children }: { data: LayoutData, children: Snippet } = $props();
  </script>

<nav class="w-auto p-4 bg-indigo-950 flex flex-row items-center justify-between">
    <div class="w-auto">
        <a class="font-bold text-3xl text-white" href="/app/dashboard">The Hunt</a>
    </div>
    <div class="w-auto p-4 flex flex-row justify-between space-x-4">
        <a class="text-xl text-{data.selected[0] == 1 ? "blue-400" : "white"}" href="/app/dashboard">Dashboard</a>
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
{@render children?.()}