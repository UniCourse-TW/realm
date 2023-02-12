<script lang="ts">
	export let data: {
		props: any;
		to: Record<string, any>;
		from: Record<string, any>;
	};
</script>

<section
	class="flex h-full w-full flex-col items-center justify-start gap-2 px-1 pt-4 sm:gap-4 sm:p-4 md:p-8"
>
	<div
		class="w-full rounded-lg bg-white p-4 shadow backdrop-blur-sm transition-all focus-within:shadow-lg hover:shadow-lg md:p-8"
	>
		<h1 class="mb-2 text-xl font-bold md:text-3xl">{data.props.name}</h1>
	</div>

	{#each data.from.Course as course}
		<a
			class="w-full rounded-lg bg-white p-4 shadow backdrop-blur-sm transition-all focus-within:shadow-lg hover:shadow-lg md:p-8"
			href="/course/{course.slug}"
		>
			<h1 class="mb-2 text-lg font-bold md:text-xl">
				{course.name} <sup class="opacity-70">{course.code}</sup>
			</h1>

			<div class="prose max-w-4xl">
				{course.description}
			</div>
		</a>
	{/each}

	<div class="p-4" />
</section>
