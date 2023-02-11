<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	let search = $page.params.query;
	const search_for = {
		course: $page.url.searchParams.get("types")?.includes("course") ?? true,
		instructor: $page.url.searchParams.get("types")?.includes("instructor") ?? true,
		provider: $page.url.searchParams.get("types")?.includes("provider") ?? true,
		program: $page.url.searchParams.get("types")?.includes("program") ?? true,
	};
	let sort = $page.url.searchParams.get("order") ?? "relevance";

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
