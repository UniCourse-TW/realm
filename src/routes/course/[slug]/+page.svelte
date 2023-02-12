<script lang="ts">
	import Icon from "@iconify/svelte";

	export let data: {
		props: any;
		to: Record<string, any>;
		from: Record<string, any>;
	};
</script>

<section class="flex h-full w-full items-center justify-center px-1 pt-4 sm:p-4 md:p-8">
	<div
		class="h-full w-full rounded-lg bg-white p-4 shadow backdrop-blur-sm transition-all focus-within:shadow-lg hover:shadow-lg md:p-8"
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

		<div class="prose max-w-4xl">
			<p>{data.props.description}</p>
		</div>
	</div>
</section>
