<script lang="ts">
    import { page } from '$app/stores';

    let {data} = $props()
</script>

<h1 class="text-3xl font-bold">Hello {data.data?.user.name}!</h1>