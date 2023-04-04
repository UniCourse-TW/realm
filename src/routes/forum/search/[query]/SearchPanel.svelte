<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { t } from "svelte-i18n";

	let search = $page.params.query;
	const search_for = {
		// keep writing
	};
	let sort = $page.url.searchParams.get("order") ?? "relevance";
	function search_forum() {
		const url = new URL(`/forum/search/${search}`, window.location.origin);
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
	function handleLeftButtonClick() {
		const url = new URL(`/forum/newPosts/`, window.location.origin);
		const params = new URLSearchParams();
		params.set("type", "article");
		url.search = params.toString();
		goto(url.toString());
	}

	function handleRightButtonClick() {
		const url = new URL(`/forum/newPosts/`, window.location.origin);
		const params = new URLSearchParams();
		params.set("type", "question");
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
				<span class="label-text font-bold"
					>{$t("forum.what-article-are-you-looking-for")}</span
				>
			</label>
			<input
				id="search"
				type="text"
				placeholder="Sweet / Teacher ..."
				class="input-bordered input w-full transition-all"
			/>
		</div>

		<div class="divider" />

		<p class="text-sm font-bold">{$t("forum.type")}</p>
		<div class="form-control">
			<label class="label cursor-pointer">
				<span class="label-text">{$t("forum.announcement")}</span>
				<input type="checkbox" class="checkbox-primary checkbox" />
			</label>
			<label class="label cursor-pointer">
				<span class="label-text">{$t("forum.article")}</span>
				<input type="checkbox" class="checkbox-primary checkbox" />
			</label>
			<label class="label cursor-pointer">
				<span class="label-text">{$t("forum.question")}</span>
				<input type="checkbox" class="checkbox-primary checkbox" />
			</label>
		</div>

		<div class="divider" />

		<div class="form-control w-full">
			<label class="label" for="sort">
				<span class="label-text font-bold">{$t("forum.sort-by")}</span>
			</label>
			<select id="sort" class="select-bordered select" bind:value={sort}>
				<option value="relevance">{$t("forum.relevance")}</option>
				<option value="newest">{$t("forum.newest")}</option>
				<option value="hot">{$t("forum.hot")}</option>
			</select>
		</div>

		<div class="divider" />

		<button class="btn-primary btn w-full" on:click={search_forum} disabled={!search}>
			{$t("search")}
		</button>
	</div>
</div>
