<script lang="ts">
	import { t } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import Icon from "@iconify/svelte";

	export let email: string;
	const is_gmail = email.endsWith("@gmail.com");

	let waiting = false;
	async function resend() {
		if (waiting) {
			return;
		}
		waiting = true;

		try {
			const res = await fetch("/api/auth/verify", { method: "POST" });
			if (!res.ok) {
				throw new Error(await res.text());
			}
		} finally {
			waiting = false;
		}
	}
</script>

<div class="alert bg-base-100 text-sm shadow-lg" transition:fly={{ y: 50, duration: 500 }}>
	<div class="flex w-full justify-between">
		<div class="flex-1">
			<Icon icon="mdi:alert-circle-outline" class="mb-0.5 mr-1 hidden text-3xl md:inline" />
			<span>{$t("me.confirming-email")}</span>
			{#if is_gmail}
				<a
					href="https://mail.google.com/mail/u/0/#search/unicourse"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-ghost btn-sm btn px-2 normal-case"
				>
					{email}
					<Icon icon="mdi:open-in-new" class="ml-1 inline text-xl" />
				</a>
			{:else}
				{email}
			{/if}
		</div>
		<button class="btn-ghost btn-sm btn px-2 normal-case" disabled={waiting} on:click={resend}>
			<Icon icon="mdi:refresh" class="mr-1 inline text-xl" />
			{$t("me.resend")}
		</button>
	</div>
</div>
