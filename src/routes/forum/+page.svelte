<script lang="ts">
	import { images } from "$lib/images";
	import { bg } from "$lib/store";
	import { onMount, onDestroy } from "svelte";
	import { t } from "svelte-i18n";
	import { fly } from "svelte/transition";

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
	<title>{$t("nav.forum")}</title>
	<meta
		name="description"
		content="Join UniCourse to share your experiences with other students"
	/>
</svelte:head>

<section class="flex h-full w-full items-center justify-center">
	<div class="alert bg-base-100 text-sm shadow-lg" transition:fly={{ y: 50, duration: 500 }}>
		<div>
			<span> {$t("wip")} </span>
		</div>
	</div>
</section>
