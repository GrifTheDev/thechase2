<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  const {
    label,
    textSize,
    clickAction,
    disabledState,
  }: {
    label: string;
    textSize: string;
    clickAction?: MouseEventHandler<HTMLButtonElement>;
    disabledState?: boolean;
  } = $props();
</script>

<button
  class="text-white text-center text-{textSize} border-[3px] bg-transparent border-white rounded-md py-2 px-6 transition ease-in-out duration-200 disabled:opacity-50 disabled:border-gray-400 enabled:hover:scale-105 enabled:hover:shadow-whiteGlowPlus enabled:hover:-rotate-1 rotate enabled:active:scale-95 enabled:active:rotate-1 enabled:active:shadow-none"
  onclick={clickAction}
  disabled={disabledState}
  >{label}</button
>
