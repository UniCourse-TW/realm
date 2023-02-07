<script lang="ts">
	import { expanded } from "$lib/store";
	import { onMount, onDestroy } from "svelte";

	const original_expanded = $expanded;

	onMount(() => {
		$expanded = true;
	});

	onDestroy(() => {
		$expanded = original_expanded;
	});
</script>

<svelte:head>
	<title>Search Articles</title>
</svelte:head>

<section class="pt-12">Search Articles</section>
