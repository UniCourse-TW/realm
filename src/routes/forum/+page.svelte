<script lang="ts">
	import { images } from "$lib/images";
	import { bg } from "$lib/store";
	import { onMount, onDestroy } from "svelte";

	const original_bg = $bg;

	onMount(async () => {
		const url = await images.wait("/images/scenery-c.png");
		if (url) {
			$bg = url;
		}
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
</svelte:head>

<section class="pt-12">Forum</section>
