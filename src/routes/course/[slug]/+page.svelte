<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";

	export let data: {
		props: any;
		to: Record<string, any>;
		from: Record<string, any>;
	};

	let rating: {
		count: number;
		score: { label: string; value: number[]; avg: string }[];
	} | null = null;

	onMount(async () => {
		const res = await fetch(`/api/course/${data.props.slug}/rating/stats`);
		const { data: d } = await res.json();
		rating = {
			count: d.count,
			score: [
				{
					label: "實用度",
					value: getValue(d.usefulness),
					avg: getAvg(d.usefulness),
				},
				{
					label: "甜度",
					value: getValue(d.sweetness),
					avg: getAvg(d.sweetness),
				},
				{
					label: "涼度",
					value: getValue(d.easiness),
					avg: getAvg(d.easiness),
				},
			],
		};

		function getValue(arr: number[]) {
			if (Math.max(...arr) === 0) return arr;
			return arr.map((e) => e / Math.max(...arr));
		}
		function getAvg(arr: number[]) {
			if (arr.length === 0) return (0).toFixed(1);
			return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
		}
	});
</script>

<section class="flex h-full w-full items-center justify-center px-1 py-4 sm:p-4 md:p-8">
	<div
		class="min-h-full w-full rounded-lg bg-white p-4 shadow backdrop-blur-sm transition-all focus-within:shadow-lg hover:shadow-lg md:p-8"
	>
		<h1 class="mb-2 text-xl font-bold md:text-3xl">
			{data.props.name} <sup class="opacity-70">{data.props.code}</sup>
		</h1>
		<div class="mb-4 flex flex-col justify-between md:flex-row md:items-center">
			<div class="flex items-center gap-2 md:text-lg">
				{#each data.to.Instructor as instructor}
					<a
						href="/course/instructor/{instructor.slug}"
						class="btn-ghost btn-sm btn text-base font-normal md:text-lg"
					>
						<Icon icon="mdi:account-heart" class="mr-1 inline text-xl md:text-2xl" />
						<span>{instructor.name}</span>
					</a>
				{/each}
			</div>
			<div class="flex items-center gap-2 md:text-lg">
				<a
					href="/course/provider/{data.to.Provider[0].slug}"
					class="btn-ghost btn-sm btn text-base font-normal md:text-lg"
				>
					<Icon
						icon="mdi:office-building-marker"
						class="mr-1 inline text-xl md:text-2xl"
					/>
					<span>{data.to.Provider[0].name}</span>
				</a>
			</div>
		</div>

		<div class="divider" />

		<div>
			<p class="prose max-w-4xl whitespace-pre-line">{data.props.description}</p>
		</div>

		<div class="divider" />

		{#if rating != null}
			<div class="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
				{#each rating.score as r}
					<div class="flex w-full flex-1 gap-6 p-4">
						<div class="flex flex-1 flex-col gap-0.5">
							{#each r.value.slice().reverse() as v, i}
								<div class="flex items-center gap-3">
									<span class="w-4">{5 - i}</span>
									<div class="h-2 flex-1 rounded-full bg-gray-300">
										<div
											class="h-2 rounded-full bg-yellow-400"
											style="width: {v}%"
										/>
									</div>
								</div>
							{/each}
						</div>
						<div class="flex flex-col items-center justify-center">
							<div class="text-xl font-bold">{r.label}</div>
							<div class="text-5xl font-bold">{r.avg}</div>
							<div class="text-gray-400">{rating.count} 則評論</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			Loading...
		{/if}
	</div>
</section>
