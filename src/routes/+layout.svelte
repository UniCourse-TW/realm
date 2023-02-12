<script lang="ts">
	import { images } from "$lib/images";
	import { bg, expanded } from "$lib/store";
	import type { ClientUser } from "$lib/types";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import Nav from "./Nav.svelte";
	import Notifications from "./Notifications.svelte";
	import PageTransition from "./PageTransition.svelte";
	import "./styles.css";

	export let data: {
		user: ClientUser | null;
	};

	onMount(() => {
		images.add("/images/scenery-a.png");
		images.add("/images/scenery-b.png");
		images.add("/images/scenery-c.png");
	});
</script>

<svelte:head>
	<title>UniCourse Realm</title>
</svelte:head>

<Nav user={data.user} />

<div class="absolute m-0 h-full w-full overflow-hidden p-0">
	{#key $bg}
		{#if $bg}
			<div
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 200 }}
				class="absolute inset-0 bg-cover bg-center"
				style="background-image: url({$bg})"
			/>
		{/if}
	{/key}
	<div
		class="m-auto h-full w-full overflow-hidden overflow-y-auto"
		class:max-w-5xl={!$expanded}
		class:p-4={!$expanded}
	>
		<PageTransition>
			<slot />
		</PageTransition>
	</div>
</div>

<Notifications />
