<script lang="ts">
	import { t } from "svelte-i18n";
	import { fly, fade } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;
	console.log("page", { data });

	function commas(x: bigint | number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const start = 300;
</script>

<section class="h-full pt-12">
	<div class="flex h-full w-full flex-col justify-center">
		<div class="mb-10">
			<h1 in:fly={{ y: 40, delay: start, duration: 500 }} class="text-4xl">UniCourse</h1>
			<h1 in:fly={{ y: -20, delay: start + 500, duration: 600 }} class="text-8xl font-bold">
				Realm
			</h1>
		</div>

		<div
			in:fly={{ y: 10, delay: start + 1200, duration: 400 }}
			class="stats stats-vertical bg-white/70 shadow backdrop-blur-xl md:stats-horizontal"
		>
			<div class="stat">
				<div in:fade={{ delay: start + 1400, duration: 300 }} class="stat-title">
					{$t("home.total-courses")}
				</div>
				<div in:fly={{ y: -5, delay: start + 1400, duration: 300 }} class="stat-value">
					{commas(data.stats.courses)}
				</div>
				<div in:fade={{ delay: start + 1400, duration: 300 }} class="stat-desc">
					NTNU, NTU, NTUST, FCU, ...
				</div>
			</div>
			<div class="stat">
				<div in:fade={{ delay: start + 1500, duration: 300 }} class="stat-title">
					{$t("home.total-posts")}
				</div>
				<div in:fly={{ y: -5, delay: start + 1500, duration: 300 }} class="stat-value">
					{commas(data.stats.posts)}
				</div>
				<div in:fade={{ delay: start + 1500, duration: 300 }} class="stat-desc">
					{$t("home.featured", { values: { title: "How to use UniCourse?" } })}
				</div>
			</div>
			<div class="stat">
				<div in:fade={{ delay: start + 1600, duration: 300 }} class="stat-title">
					{$t("home.active-users")}
				</div>
				<div in:fly={{ y: -5, delay: start + 1600, duration: 300 }} class="stat-value">
					{commas(data.stats.users)}
				</div>
				<div in:fade={{ delay: start + 1600, duration: 300 }} class="stat-desc">
					{$t("home.from-over-n-schools", { values: { n: 32 } })}
				</div>
			</div>
		</div>
	</div>
</section>
