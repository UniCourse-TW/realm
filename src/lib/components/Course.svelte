<script lang="ts">
	import { strip } from "$lib/utils";
	import pangu from "pangu";

	const type = "Course";
	export let props: Record<string, any>;
	export let to: Record<string, any> | null = null;
	export let from: Record<string, any> | null = null;
	export let show_description: boolean = true;

	function link(type: string, slug: string): string {
		if (type.toLowerCase() === "course") {
			return `/course/${slug}`;
		} else {
			return `/course/${type.toLowerCase()}/${slug}`;
		}
	}

	const SUMMARY_LENGTH = 50;
	$: brief_description = strip(props.description, SUMMARY_LENGTH);
</script>

<a
	class="card m-4 bg-base-100 shadow-sm transition-all hover:shadow-lg"
	href={link(type, props.slug)}
>
	<div class="card-body">
		<h2 class="card-title">
			{props.name}
		</h2>
		<p
			class="prose max-h-80 whitespace-pre-line"
			class:hidden={!show_description || !props.description}
		>
			{pangu.spacing(brief_description || "No description. QQ")}
		</p>
		{#if to || from}
			<div class="divider" class:hidden={!props.description} />
			<div class="flex max-h-80 min-w-full" class:max-w-sm={!!props.description}>
				{#if to !== null}
					{#each Object.entries(to) as [key, items]}
						<div class="mb-4 flex-1">
							<h3 class="font-bold">{key}</h3>
							{#each items as item}
								<a
									href={link(item.LABELS[0], item.slug)}
									class="btn-ghost btn-sm btn"
								>
									{item.name}
								</a>
							{/each}
						</div>
					{/each}
				{/if}

				{#if from !== null}
					{#each Object.entries(from) as [key, items]}
						<div class="mb-4 flex-1">
							<h3 class="font-bold">{key}</h3>
							{#each items as item}
								<a
									href={link(item.LABELS[0], item.slug)}
									class="btn-ghost btn-sm btn"
								>
									{item.name}
								</a>
							{/each}
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</a>
