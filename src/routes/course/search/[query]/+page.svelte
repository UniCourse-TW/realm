<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { expanded } from "$lib/store";
	import pangu from "pangu";
	import { onMount, onDestroy } from "svelte";

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

	let search = $page.params.query;
	const search_for = {
		course: $page.url.searchParams.get("types")?.includes("course") ?? true,
		instructor: $page.url.searchParams.get("types")?.includes("instructor") ?? true,
		provider: $page.url.searchParams.get("types")?.includes("provider") ?? true,
		program: $page.url.searchParams.get("types")?.includes("program") ?? true,
	};
	let sort = $page.url.searchParams.get("order") ?? "relevance";

	onMount(() => {
		$expanded = true;
		console.log(data);
	});

	onDestroy(() => {
		$expanded = original_expanded;
	});

	let composing = false;

	function search_courses() {
		const url = new URL(`/course/search/${search}`, window.location.origin);
		const params = new URLSearchParams();
		params.set(
			"types",
			Object.entries(search_for)
				.filter(([_, v]) => v)
				.map(([k, _]) => k)
				.join(","),
		);
		params.set("order", sort);

		url.search = params.toString();
		goto(url.toString());
	}
</script>

<svelte:head>
	<title>Search Courses</title>
</svelte:head>

<section class="flex h-full w-full p-0">
	<div class="hidden h-full w-0 p-4 pt-6 md:block md:w-60 lg:w-80">
		<div
			class="flex h-full w-full flex-col rounded-lg bg-white p-4 opacity-90 shadow-sm transition-all focus-within:opacity-100 hover:opacity-100 hover:shadow-lg"
		>
			<div class="form-control w-full">
				<label class="label" for="search">
					<span class="label-text font-bold">What are you looking for?</span>
				</label>
				<input
					id="search"
					type="text"
					bind:value={search}
					placeholder="Course / Provider / Instructor ..."
					class="input-bordered input w-full transition-all"
					on:keydown={(e) => {
						if (e.key === "Enter" && search && !composing) {
							search_courses();
						}
					}}
					on:compositionstart={() => (composing = true)}
					on:compositionend={() => setTimeout(() => (composing = false), 30)}
				/>
			</div>

			<div class="divider" />

			<p class="text-sm font-bold">Search for</p>
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">Courses</span>
					<input
						type="checkbox"
						bind:checked={search_for.course}
						class="checkbox-primary checkbox"
					/>
				</label>
				<label class="label cursor-pointer">
					<span class="label-text">Instructors</span>
					<input
						type="checkbox"
						bind:checked={search_for.instructor}
						class="checkbox-primary checkbox"
					/>
				</label>
				<label class="label cursor-pointer">
					<span class="label-text">Providers</span>
					<input
						type="checkbox"
						bind:checked={search_for.provider}
						class="checkbox-primary checkbox"
					/>
				</label>
				<label class="label cursor-pointer">
					<span class="label-text">Programs</span>
					<input
						type="checkbox"
						bind:checked={search_for.program}
						class="checkbox-primary checkbox"
					/>
				</label>
			</div>

			<div class="divider" />

			<div class="form-control w-full">
				<label class="label" for="sort">
					<span class="label-text font-bold">Sort by</span>
				</label>
				<select id="sort" class="select-bordered select" bind:value={sort}>
					<option value="relevance">Relevance</option>
					<option value="name">Name</option>
					<option value="type">Course Type</option>
				</select>
			</div>

			<div class="divider" />

			<button class="btn-primary btn w-full" on:click={search_courses} disabled={!search}>
				Search
			</button>
		</div>
	</div>
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
