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
		const url = await images.wait("/images/scenery-b.png");
		console.log({ url });
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
	<title>{$t("course.search-courses")}</title>
	<meta name="description" content="Find your interested courses on UniCourse" />
</svelte:head>

<section class="flex h-full w-full items-center justify-center">
	<div
		class="w-full max-w-2xl rounded-lg bg-white/20 p-4 shadow backdrop-blur-sm transition-all focus-within:shadow-lg hover:shadow-lg md:p-8"
	>
		<div class="form-control w-full">
			<label class="label" for="find-courses">
				<span class="label-text text-xl text-white drop-shadow-lg"
					>{$t("course.what-course-are-you-looking-for")}</span
				>
			</label>
			<div class="input-group">
				<input
					id="find-courses"
					type="text"
					placeholder={$t("course.ex-computer-programming")}
					bind:value={search}
					class="input-bordered input w-full opacity-80 transition-all focus:opacity-100"
					tabindex="0"
					on:keydown={(e) => {
						if (e.key === "Enter" && search && !composing) {
							goto(`/course/search/${search}`);
						}
					}}
					on:compositionstart={() => (composing = true)}
					on:compositionend={() => setTimeout(() => (composing = false), 30)}
				/>
				<a class="btn-square btn" href="/course/search/{search}" tabindex="0">
					<Icon icon="mdi:magnify" class="h-6 w-6" />
				</a>
			</div>
		</div>
	</div>
</section>
