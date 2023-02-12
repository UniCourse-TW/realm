<script lang="ts">
	import { append } from "$lib/notification";
	import { t } from "svelte-i18n";
	import { fly } from "svelte/transition";

	let invitation_count = 1;
	let invitations: string[] = [];

	async function mint() {
		for (let i = 0; i < invitation_count; i++) {
			const res = await fetch("/api/auth/invitation/create");
			const json = await res.json();
			if (json.data.code) {
				invitations.push(json.data.code);
				invitations = invitations;
			} else {
				console.error(json);
			}
		}
	}

	async function copy(text: string) {
		await navigator.clipboard.writeText(text);
		append($t("copied-to-clipboard"), "success");
	}
</script>

<div
	transition:fly={{ y: 50, delay: 800, duration: 500 }}
	class="card my-8 bg-base-100 p-4 shadow-lg md:p-8"
>
	<div class="flex flex-col lg:flex-row">
		<div class="flex flex-col gap-4">
			<div>
				<h1 class="text-2xl">{$t("me.management")}</h1>
			</div>

			<div>
				<h2 class="mb-2 font-bold">{$t("invitations")}</h2>
				<div class="form-control">
					<div class="input-group">
						<input
							type="number"
							min="1"
							max="5"
							placeholder="Number"
							bind:value={invitation_count}
							class="input-bordered input"
						/>
						<button class="btn-outline btn" on:click={mint}>
							{$t("me.mint-invitation")}
						</button>
					</div>
				</div>

				{#each invitations as invitation}
					<div class="form-control my-2">
						<div class="input-group">
							<input
								type="text"
								bind:value={invitation}
								class="input-bordered input input-sm w-64 font-mono"
								disabled
							/>
							<button
								class="btn-outline btn-sm btn"
								on:click={() => copy(invitation)}
							>
								{$t("copy")}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
