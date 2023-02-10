<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { hash } from "unicourse";

	let mode: "login" | "register" = "login";
	let running = false;
	let err = "";

	let username = "";
	let password = "";
	let password_confirm = "";
	let email = "";
	let invitation = "";

	$: {
		console.log("switched to mode: " + mode);
		err = "";
	}

	async function login() {
		if (username === "" || password === "") {
			err = "Please fill in username and password";
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
				err = "Unknown Error";
			}
		} finally {
			running = false;
		}
	}

	async function register() {
		if (username === "" || password === "" || email === "" || invitation === "") {
			err = "Please fill in all fields";
			return;
		}

		running = true;
		err = "";
		try {
			if (password !== password_confirm) {
				throw new Error("Passwords do not match");
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
				err = "Unknown Error";
			}
		} finally {
			running = false;
		}
	}
</script>

<div class="form-control w-full">
	<span class="label">
		<span class="label-text">Username</span>
	</span>
	<input
		type="text"
		bind:value={username}
		placeholder="Your username"
		class="input-bordered input w-full"
		disabled={running}
		tabindex="0"
	/>

	<span class="label">
		<span class="label-text">Password</span>
	</span>

	<input
		type="password"
		bind:value={password}
		placeholder="Your password"
		class="input-bordered input w-full"
		disabled={running}
		tabindex="0"
	/>

	{#if mode === "register"}
		<span class="label">
			<span class="label-text">Confirm Password</span>
		</span>

		<input
			type="password"
			bind:value={password_confirm}
			placeholder="Confirm your password"
			class="input-bordered input w-full"
			disabled={running}
			tabindex="0"
		/>

		<span class="label">
			<span class="label-text">Email</span>
		</span>

		<input
			type="email"
			bind:value={email}
			placeholder="Your email"
			class="input-bordered input w-full"
			disabled={running}
			tabindex="0"
		/>

		<span class="label">
			<span class="label-text">Invitation Code</span>
		</span>

		<input
			type="text"
			bind:value={invitation}
			placeholder="Your invitation code"
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
			{mode === "login" ? "Login" : "Register"}
		</button>

		<button
			class="btn-outline btn ml-2 normal-case"
			on:click={() => (mode = mode === "login" ? "register" : "login")}
			disabled={running}
		>
			{mode === "login" ? "Register" : "Login"}
		</button>
	</div>

	<div class="divider" />

	<div class="flex flex-row justify-end text-right">
		<span class="text-sm text-opacity-70">
			By logging in or registering, you agree to our <br />
			<a href="/terms" class="link">Terms of Service</a>
			and
			<a href="/privacy" class="link">Privacy Policy</a>
		</span>
	</div>
</div>
