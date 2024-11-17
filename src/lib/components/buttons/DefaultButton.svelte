<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  const { label, textSize, clickAction }: { label: string, textSize: string, clickAction: MouseEventHandler<HTMLButtonElement> } = $props();
</script>

<button
  class="text-white text-center text-{textSize} border border-white rounded-md p-2 animate-buttonUnHover hover:animate-buttonHover active:animate-buttonActivate"
  onclick={clickAction}>{label}</button
>
