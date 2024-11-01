<script lang="ts">
  const { label, textSize } = $props();
</script>

<button
  class="text-white text-center text-{textSize} border border-white rounded-md p-2 animate-buttonUnHover hover:animate-buttonHover active:animate-buttonActivate"
  >{label}</button
>
