<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import type { ClientUser } from "$lib/types";
	import { t } from "svelte-i18n";
	import { fly } from "svelte/transition";

	export let user: ClientUser;

	let logging_out = false;
	async function logout() {
		logging_out = true;
		try {
			const res = await fetch("/api/auth/logout");

			if (res.ok) {
				await invalidateAll();
			}
		} catch (err) {
			console.error(err);
		} finally {
			logging_out = false;
		}
	}
</script>

<div
	transition:fly={{ y: 50, delay: 200, duration: 500 }}
	class="card my-8 bg-base-100 p-4 shadow-lg md:p-8"
>
	<div class="flex flex-col lg:flex-row">
		<div>
			<h1 class="text-2xl font-bold md:text-3xl lg:text-4xl">
				{$t("me.nice-to-see-you", { values: { user: user.name || user.username } })}
			</h1>
			<p class="prose py-4 md:py-6">
				{@html $t("me.logged-in-as", { values: { user: user.username } })}<br />
				{$t("me.roles")}<span class="font-bold">{user.roles.join(", ")}</span>.
			</p>
			<button class="btn-outline btn-error btn" on:click={logout} disabled={logging_out}>
				{$t("logout")}
			</button>
		</div>
	</div>
</div>
