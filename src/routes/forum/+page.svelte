<script lang="ts">
	import { goto } from "$app/navigation";
	import { images } from "$lib/images";
	import { bg } from "$lib/store";
	import { onMount, onDestroy } from "svelte";
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";

	const original_bg = $bg;
	let search = "";

	onMount(async () => {
		const url = await images.wait("/images/scenery-c.png");
		if (url) {
			$bg = url;
		}
	});

	onDestroy(() => {
		$bg = original_bg;
	});

	let composing = false;
</script>

<svelte:head>
	<title>{$t("forum.search-articles")}</title>
	<meta
		name="description"
		content="Join UniCourse to share your experiences with other students"
	/>
</svelte:head>

<section class="flex h-full w-full items-center justify-center">
	<div
		class="w-full max-w-2xl rounded-lg bg-white/20 p-4 shadow backdrop-blur-sm transition-all focus-within:shadow-lg hover:shadow-lg md:p-8"
	>
		<div class="form-control w-full">
			<label class="label" for="find-articles">
				<span class="label-text text-xl text-white drop-shadow-lg"
					>{$t("forum.what-article-are-you-looking-for")}</span
				>
			</label>
			<div class="input-group">
				<input
					id="find-articles"
					type="text"
					placeholder={$t("forum.ex-great-course-recommendations")}
					bind:value={search}
					class="input-bordered input w-full opacity-80 transition-all focus:opacity-100"
					tabindex="0"
					on:keydown={(e) => {
						if (e.key === "Enter" && search && !composing) {
							goto(`/forum/search/${search}`);
						}
					}}
					on:compositionstart={() => (composing = true)}
					on:compositionend={() => setTimeout(() => (composing = false), 30)}
				/>
				<a class="btn-square btn" href="/forum/search/{search}" tabindex="0">
					<Icon icon="mdi:magnify" class="h-6 w-6" />
				</a>
			</div>
		</div>
	</div>
</section>

<!-- <section class="flex h-full w-full items-center justify-center">
	<div class="alert bg-base-100 text-sm shadow-lg" transition:fly={{ y: 50, duration: 500 }}>
		<div>
			<span> {$t("wip")} </span>
		</div>
	</div>
</section> -->
