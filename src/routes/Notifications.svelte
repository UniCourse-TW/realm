<script lang="ts">
	import { notifications } from "$lib/store";
	import { fade } from "svelte/transition";
</script>

<div class="toast-end toast">
	{#each $notifications as notification (notification.id)}
		<div
			transition:fade={{ duration: 300 }}
			class="alert"
			class:alert-info={notification.type === "info"}
			class:alert-success={notification.type === "success"}
			class:alert-error={notification.type === "error"}
		>
			<div>
				<span>{notification.content}</span>
			</div>
		</div>
	{/each}
</div>
