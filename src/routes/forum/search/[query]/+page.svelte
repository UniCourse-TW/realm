<script lang="ts">
	import { page } from "$app/stores";
	import { expanded } from "$lib/store";
	import pangu from "pangu";
	import { onMount, onDestroy } from "svelte";
	import { t } from "svelte-i18n";
	import SearchPanel from "./SearchPanel.svelte";

	const original_expanded = $expanded;

	export let data: {
		result: {
			type: string;
			score: number;
			props: Record<string, any>;
			to: Record<string, any>;
			from: Record<string, any>;
		}[];
	};

	onMount(() => {
		$expanded = true;
		console.log(data);
	});

	onDestroy(() => {
		$expanded = original_expanded;
	});
	function link(type: string, slug: string): string {
		if (type.toLowerCase() === "forum") {
			return `/forum/${slug}`;
		} else {
			return `/forum/${type.toLowerCase()}/${slug}`;
		}
	}
</script>

<svelte:head>
	<title>{$t("forum.search-articles")}: {$page.params.query}</title>
</svelte:head>

<section class="flex h-full w-full p-0">
	<SearchPanel />

	<div class="h-full flex-1 overflow-auto">
		<div class="flex h-full flex-col">
			<!-- <div class="h-full flex-1">
				<div class="m-0 h-2 p-0" />
			</div> -->

			{#if data.result.length === 0}
				<div class="h-full w-full">
					<p class="m-auto p-8">No results found. Try searching for something else.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
