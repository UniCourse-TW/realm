<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let max: number = 5;
	export let value: number | undefined;
	export let mutable: boolean = false;

	const dispatch = createEventDispatcher<{ update: number }>();
</script>

<div class="btn-group">
	{#each Array(max) as _, idx}
		<button
			class="btn-outline btn-xs btn"
			class:btn-active={value === idx + 1}
			class:btn-disabled={!mutable}
			on:click={() => {
				dispatch("update", idx + 1);
			}}
		>
			{idx + 1}
		</button>
	{/each}
</div>
