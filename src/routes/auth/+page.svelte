<script lang="ts">
	import Auth from "$lib/actions/Auth.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { bg } from "$lib/store";
	import { onMount, onDestroy } from "svelte";

	const original_bg = $bg;

	onMount(() => {
		$bg = "/images/scenery-a.png";
		document.querySelector<HTMLDivElement>("#auth-btn")?.click();
	});

	onDestroy(() => {
		$bg = original_bg;
	});
</script>

<svelte:head>
	<title>Join UniCourse Realm</title>
	<meta name="description" content="Join UniCourse Realm" />
	<link rel="prefetch" href="/images/scenery-a.png" />
</svelte:head>

<div class="flex h-full w-full flex-col items-center justify-center md:flex-row">
	<Popup id="login">
		<div id="auth-btn" class="btn-outline btn animate-bounce" slot="button">Auth</div>
		<Auth slot="body" />
	</Popup>
</div>
