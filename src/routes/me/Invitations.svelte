<script lang="ts">
	import { append } from "$lib/notification";
	import { t } from "svelte-i18n";
	import { fly } from "svelte/transition";

	export let invitations: {
		invitation: { code: string; created: number; revoked: boolean };
		user?: string;
		at?: number;
	}[] = [];

	async function copy(text: string) {
		await navigator.clipboard.writeText(text);
		append($t("copied-to-clipboard"), "success");
	}

	async function claim() {
		const res = await fetch("/api/auth/invitation/claim");
		if (res.ok) {
			const { data } = await res.json();
			if (data.code) {
				invitations.push({
					invitation: { code: data.code, created: Date.now(), revoked: false },
				});
				append($t("me.invitation-claimed"), "success");
			} else {
				append("Next: " + second_to_time(data.next / 1000), "info");
			}
		}
	}

	function second_to_time(s: number) {
		const hours = Math.floor(s / 3600);
		const minutes = Math.floor((s % 3600) / 60);
		const seconds = Math.floor(s % 60);
		return `${hours}h ${minutes}m ${seconds}s`;
	}
</script>

<div
	transition:fly={{ y: 50, delay: 400, duration: 500 }}
	class="card my-8 bg-base-100 p-4 shadow-lg md:p-8"
>
	<div class="flex flex-col lg:flex-row">
		<div class="flex flex-col gap-4">
			<div>
				<h1 class="text-2xl">{$t("me.invitations")}</h1>
			</div>

			<div>
				{#each invitations as invitation}
					<div class="form-control my-2">
						<div class="input-group" class:opacity-50={invitation.invitation.revoked}>
							<input
								type="text"
								bind:value={invitation.invitation.code}
								title="created at {new Date(
									invitation.invitation.created,
								).toLocaleString()}"
								class="input-bordered input input-sm w-64 font-mono"
								disabled
							/>
							<button
								class="btn-outline btn-sm btn"
								on:click={() => copy(invitation.invitation.code)}
								disabled={invitation.invitation.revoked}
							>
								{$t("copy")}
							</button>
						</div>
					</div>
				{/each}
			</div>

			<button class="btn-outline btn" on:click={claim}> Claim </button>
		</div>
	</div>
</div>
