<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import type { RoleType } from "$lib/constants";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import { hash } from "unicourse";

	let mode: "login" | "register" = "login";
	let running = false;
	let err = "";

	let username = "";
	let password = "";
	let password_confirm = "";
	let email = "";
	let invitation = "";
	let roles: RoleType[] | null = null;

	$: {
		console.log("switched to mode: " + mode);
		err = "";
	}

	onMount(() => {
		const params = new URLSearchParams(location.search);
		if (params.has("username")) username = params.get("username")!;
		if (params.has("roles")) roles = params.get("roles")!.split(",") as RoleType[];
		if (params.has("code")) invitation = params.get("code")!;
		if (roles || invitation) mode = "register";
	});

	async function login() {
		if (username === "" || password === "") {
			err = $t("auth.please-fill-in-username-and-password");
			return;
		}

		running = true;
		err = "";
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password: await hash(password),
				}),
			});

			const { error, data } = await res.json();
			if (error) {
				throw new Error(error);
			} else {
				await invalidateAll();
			}
		} catch (error) {
			if (error instanceof Error) {
				err = error.message;
			} else {
				err = $t("unknown-error");
			}
		} finally {
			running = false;
		}
	}

	async function register() {
		if (username === "" || password === "" || email === "") {
			err = $t("please-fill-in-all-fields");
			return;
		}

		running = true;
		err = "";
		try {
			if (password !== password_confirm) {
				throw new Error($t("auth.passwords-do-not-match"));
			}

			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password: await hash(password),
					email,
					invitation,
					roles,
				}),
			});

			const { error, data } = await res.json();
			if (error) {
				throw new Error(error);
			} else {
				await invalidateAll();
			}
		} catch (error) {
			if (error instanceof Error) {
				err = error.message;
			} else {
				err = $t("unknown-error");
			}
		} finally {
			running = false;
		}
	}
</script>

<div class="form-control w-full">
	<span class="label">
		<span class="label-text">{$t("auth.username")}</span>
	</span>
	<input
		type="text"
		bind:value={username}
		placeholder={$t("auth.your-username")}
		class="input-bordered input w-full"
		disabled={running}
		tabindex="0"
	/>

	<span class="label">
		<span class="label-text">{$t("auth.password")}</span>
	</span>

	<input
		type="password"
		bind:value={password}
		placeholder={$t("auth.your-password")}
		class="input-bordered input w-full"
		disabled={running}
		tabindex="0"
	/>

	{#if mode === "register"}
		<span class="label">
			<span class="label-text">{$t("auth.confirm-password")}</span>
		</span>

		<input
			type="password"
			bind:value={password_confirm}
			placeholder={$t("auth.confirm-your-password")}
			class="input-bordered input w-full"
			disabled={running}
			tabindex="0"
		/>

		<span class="label">
			<span class="label-text">{$t("auth.email")}</span>
		</span>

		<input
			type="email"
			bind:value={email}
			placeholder={$t("auth.your-email")}
			class="input-bordered input w-full"
			disabled={running}
			tabindex="0"
		/>

		<span class="label">
			<span class="label-text">{$t("auth.invitation-code")}</span>
		</span>

		<input
			type="text"
			bind:value={invitation}
			placeholder={$t("auth.your-invitation-code")}
			class="input-bordered input w-full"
			disabled={running}
			tabindex="0"
		/>
	{/if}

	{#if err}
		<div class="p-1 text-sm text-error">{err}</div>
	{/if}

	<div class="flex flex-row justify-end pt-8">
		<button
			class="btn-primary btn"
			on:click={mode === "login" ? login : register}
			disabled={running}
		>
			{mode === "login" ? $t("auth.login") : $t("auth.register")}
		</button>

		<button
			class="btn-outline btn ml-2 normal-case"
			on:click={() => (mode = mode === "login" ? "register" : "login")}
			disabled={running}
		>
			{mode === "login" ? $t("auth.register") : $t("auth.login")}
		</button>
	</div>

	<div class="divider" />

	<div class="flex flex-row justify-end text-right">
		<span class="text-sm text-opacity-70">
			{$t("auth.agreement-notice")} <br />
			<a href="/terms" class="link">{$t("tos")}</a>
			{$t("and")}
			<a href="/privacy" class="link">{$t("privacy-policy")}</a>
		</span>
	</div>
</div>
