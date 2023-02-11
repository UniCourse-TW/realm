<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import type { ClientUser } from "$lib/types";
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
				Nice to see you, <wbr />
				{user.name || user.username}!
			</h1>
			<p class="prose py-4 md:py-6">
				You are logged in as <span class="font-bold">{user.username}</span>. <br />
				Roles: <span class="font-bold">{user.roles.join(", ")}</span>.
			</p>
			<button class="btn-outline btn-error btn" on:click={logout} disabled={logging_out}>
				Logout
			</button>
		</div>
	</div>
</div>
