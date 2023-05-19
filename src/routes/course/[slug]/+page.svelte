<script lang="ts">
	import Rating from "$lib/components/Rating.svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";

	export let data: {
		props: any;
		to: Record<string, any>;
		from: Record<string, any>;
		user: { username: string };
	};

	interface Rating {
		usefulness?: number;
		sweetness?: number;
		easiness?: number;
		comment?: string;
		created?: number;
	}

	let rating_stats: {
		count: number;
		score: { label: string; widths: number[]; avg: string }[];
	} | null = null;
	let my_rating: Rating = { comment: "" };
	let ratings: Array<Rating & { id: number; user: { username: string; id: number } }> = [];
	let editing = false;
	let form_error = "";
	let submitting = false;

	onMount(() => {
		console.log(data);
		get_rating_stats();
		get_my_rating();
		get_ratings();
	});

	async function get_rating_stats() {
		const res = await fetch(`/api/course/${data.props.slug}/rating/stats`);
		const { data: d } = await res.json();
		rating_stats = {
			count: d.count,
			score: [
				{
					label: "實用度",
					widths: get_normalized_widths(d.usefulness),
					avg: get_avg(d.usefulness),
				},
				{
					label: "甜度",
					widths: get_normalized_widths(d.sweetness),
					avg: get_avg(d.sweetness),
				},
				{
					label: "涼度",
					widths: get_normalized_widths(d.easiness),
					avg: get_avg(d.easiness),
				},
			],
		};
	}
	async function get_my_rating() {
		const res = await fetch(`/api/course/${data.props.slug}/rating/me`).then((r) => r.json());
		if (res.data) my_rating = res.data;
	}
	async function get_ratings() {
		const res = await fetch(`/api/course/${data.props.slug}/rating`).then((r) => r.json());
		if (res.data) ratings = res.data;
	}
	async function submit() {
		if (!my_rating.usefulness || !my_rating.sweetness || !my_rating.easiness) {
			form_error = $t("course.form_error");
			return;
		}
		submitting = true;
		try {
			await fetch(`/api/course/${data.props.slug}/rating/me`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(my_rating),
			});
			get_my_rating();
		} catch (error) {
			console.error(error);
		} finally {
			submitting = false;
		}
	}
	function get_normalized_widths(arr: number[]) {
		if (Math.max(...arr) === 0) return arr;
		return arr.map((e) => e / Math.max(...arr));
	}
	function get_avg(arr: number[]) {
		const sum = arr.reduce((a, b) => a + b, 0);
		if (sum === 0) return (0).toFixed(1);
		const weighted_sum = arr.reduce((a, b, i) => a + b * (i + 1), 0);
		return (weighted_sum / sum).toFixed(1);
	}
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

		{#if rating_stats != null}
			<div class="text-primary">
				<span class="font-bold">{rating_stats.count}</span>{" " +
					$t("course.num_of_review")}
			</div>
			<div class="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
				{#each rating_stats.score as r}
					<div class="flex w-full flex-1 gap-6 p-4">
						<div class="flex flex-1 flex-col gap-0.5">
							{#each r.widths.slice().reverse() as w, i}
								<div class="flex items-center gap-3">
									<span class="w-4">{5 - i}</span>
									<div class="h-2 flex-1 rounded-full bg-gray-300">
										<div
											class="h-2 rounded-full bg-yellow-400"
											style="width: {w * 100}%"
										/>
									</div>
								</div>
							{/each}
						</div>
						<div class="flex flex-col items-center justify-center">
							<div class="text-5xl font-bold">{r.avg}</div>
							<div class="text-xl font-bold">{r.label}</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex animate-pulse flex-col gap-4">
				<div class="text-primary">{$t("course.review")}</div>
				<div class="grid grid-cols-3 gap-2">
					{#each Array(15) as i}
						<div class="h-2 w-full rounded bg-violet-300" />
					{/each}
				</div>
			</div>
		{/if}

		<div class="my-2" />

		{#if my_rating.created != null}
			<div class="flex gap-x-6">
				<div class="mr-3 whitespace-nowrap font-semibold">{$t("course.your_review")}</div>
				<div class="flex flex-col gap-y-2 whitespace-nowrap">
					<div class="flex items-center justify-end gap-x-2">
						<span class="font-semibold">實用度</span>
						<Rating value={my_rating.usefulness} />
					</div>
					<div class="flex items-center justify-end gap-x-2">
						<span class="font-semibold">甜度</span>
						<Rating value={my_rating.sweetness} />
					</div>
					<div class="flex items-center justify-end gap-x-2">
						<span class="font-semibold">涼度</span>
						<Rating value={my_rating.easiness} />
					</div>
				</div>
				{#if my_rating.comment}
					<textarea
						bind:value={my_rating.comment}
						readonly
						class="textarea-bordered textarea textarea-disabled w-full"
						tabindex="0"
					/>
				{/if}
			</div>
		{:else if !editing}
			<div class="flex justify-center">
				<button
					class="btn-outline btn-sm btn rounded-full text-sm normal-case"
					on:click={() => {
						editing = true;
					}}
				>
					<Icon icon="mdi:comment-edit" class="mr-1.5 h-4 w-4" />
					{$t("course.write_review")}
				</button>
			</div>
		{:else}
			<div class="flex flex-col gap-y-2">
				<div class="flex gap-x-6">
					<div class="flex flex-col gap-y-2 whitespace-nowrap">
						<div class="flex items-center justify-end gap-x-2">
							<span class="font-semibold">實用度</span>
							<Rating
								value={my_rating.usefulness}
								mutable={!submitting}
								on:update={(event) => {
									my_rating.usefulness = event.detail;
								}}
							/>
						</div>
						<div class="flex items-center justify-end gap-x-2">
							<span class="font-semibold">甜度</span>
							<Rating
								value={my_rating.sweetness}
								mutable={!submitting}
								on:update={(event) => {
									my_rating.sweetness = event.detail;
								}}
							/>
						</div>
						<div class="flex items-center justify-end gap-x-2">
							<span class="font-semibold">涼度</span>
							<Rating
								value={my_rating.easiness}
								mutable={!submitting}
								on:update={(event) => {
									my_rating.easiness = event.detail;
								}}
							/>
						</div>
					</div>
					<textarea
						placeholder={$t("course.review_placeholder")}
						bind:value={my_rating.comment}
						class="textarea-bordered textarea w-full"
						class:textarea-disabled={submitting}
						tabindex="0"
					/>
				</div>
				<div class="flex items-center justify-end">
					{#if form_error}
						<span class="text-sm text-error">{form_error}</span>
						<div class="flex-1" />
					{/if}
					<button
						class="btn-outline btn-error btn-sm btn mr-6"
						class:loading={submitting}
						on:click={() => {
							editing = false;
						}}>Cancel</button
					>
					<button
						class="btn-primary btn-sm btn"
						class:loading={submitting}
						on:click={submit}>Submit</button
					>
				</div>
			</div>
		{/if}

		{#each ratings.filter((e) => e.user.username !== data.user.username) as r, i}
			<hr class="my-8" />

			<div class="flex gap-x-6">
				<div class="mr-3 whitespace-nowrap font-semibold">{r.user.username}</div>
				<div class="flex flex-col gap-y-2 whitespace-nowrap">
					<div class="flex items-center justify-end gap-x-2">
						<span class="font-semibold">實用度</span>
						<Rating value={r.usefulness} />
					</div>
					<div class="flex items-center justify-end gap-x-2">
						<span class="font-semibold">甜度</span>
						<Rating value={r.sweetness} />
					</div>
					<div class="flex items-center justify-end gap-x-2">
						<span class="font-semibold">涼度</span>
						<Rating value={r.easiness} />
					</div>
				</div>
				{#if r.comment}
					<textarea
						bind:value={r.comment}
						readonly
						class="textarea-bordered textarea textarea-disabled w-full"
						tabindex="0"
					/>
				{/if}
			</div>
		{/each}
	</div>
</section>
