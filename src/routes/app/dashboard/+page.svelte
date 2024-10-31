<script lang="ts">
    let {data} = $props()
</script>
<div class='w-screen h-screen bg-dashboard-bg py-3'>
<div class="w-auto h-auto m-3 pb-3 mt-0">
    <h1 class="text-3xl font-bold text-white">Hello {data.localsData.user.name}, how are you doing today?</h1>
</div>
</div>

