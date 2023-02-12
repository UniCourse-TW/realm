<script lang="ts">
	import { expanded } from "$lib/store";
	import pangu from "pangu";
	import { onMount, onDestroy } from "svelte";
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
</script>

<svelte:head>
	<title>Search Courses</title>
</svelte:head>

<section class="flex h-full w-full p-0">
	<SearchPanel />

	<div class="h-full flex-1 overflow-auto">
		<div class="flex h-full flex-col">
			<div class="h-full flex-1">
				{#each data.result as result}
					<a
						class="card mx-4 mt-6 mb-2 bg-base-100 shadow-sm transition-all hover:shadow-lg"
						href="/course/{result.props.slug}"
					>
						<div class="card-body">
							<h2 class="card-title">
								{result.props.name}
								<sup class="opacity-70">{result.type}</sup>
							</h2>
							<div class="flex w-full">
								<p
									class="prose max-h-80 flex-1 overflow-auto whitespace-pre-line"
									class:hidden={!result.props.description}
								>
									{pangu.spacing(
										result.props.description || "No description. QQ",
									)}
								</p>
								<div
									class="divider divider-horizontal"
									class:hidden={!result.props.description}
								/>
								<div
									class="max-h-80 overflow-auto"
									class:max-w-sm={!!result.props.description}
								>
									{#each Object.entries(result.to) as [key, items]}
										<div class="mb-4">
											<h3 class="font-bold">{key}</h3>
											{#each items as item}
												<a
													href="/course/{item.slug}"
													class="btn-ghost btn-sm btn"
												>
													{item.name}
												</a>
											{/each}
										</div>
									{/each}
									{#each Object.entries(result.from) as [key, items]}
										<div class="mb-4">
											<h3 class="font-bold">{key}</h3>
											{#each items as item}
												<a
													href="/course/{item.slug}"
													class="btn-ghost btn-sm btn"
												>
													{item.name}
												</a>
											{/each}
										</div>
									{/each}
								</div>
							</div>
						</div>
					</a>
				{/each}
				<div class="m-0 h-2 p-0" />
			</div>

			{#if data.result.length === 0}
				<div class="h-full w-full">
					<p class="m-auto p-8">No results found. Try searching for something else.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
