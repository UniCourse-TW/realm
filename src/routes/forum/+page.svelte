<script lang="ts">
	import { bg } from "$lib/store";
	import { onMount, onDestroy } from "svelte";

	const original_bg = $bg;

	onMount(() => {
		$bg = "/images/scenery-c.png";
	});

	onDestroy(() => {
		$bg = original_bg;
	});
</script>

<svelte:head>
	<title>Forum</title>
	<meta
		name="description"
		content="Join UniCourse to share your experiences with other students"
	/>
	<link rel="prefetch" href="/images/scenery-c.png" />
</svelte:head>

<section class="pt-12">Forum</section>
