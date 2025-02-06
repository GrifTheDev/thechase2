<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>{$page.error?.message}</h1>
<h2>{$page.error?.devDump}</h2>