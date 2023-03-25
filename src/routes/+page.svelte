<script lang="ts">
	import { goto } from "$app/navigation";
	import { Role } from "$lib/constants";
	import type { RoleType } from "$lib/constants";
	import { t } from "svelte-i18n";
	import { fly, fade } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;
	console.log("page", { data });

	function commas(x: bigint | number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const start = 300;

	const roleOptions: RoleType[] = [Role.Verified, Role.CoursePacker, Role.Moderator];
	let username = "";
	let roles: RoleType[] = [];
	$: isComplete = username.length > 0 && roles.length > 0;
	function getStarted() {
		if (isComplete) {
			goto(`/auth?username=${username}&roles=${roles.join(",")}&code=${data.code}`);
		}
	}
</script>

<section class="h-full pt-12">
	<div class="flex h-full w-full flex-col justify-center">
		{#if data.stats.users == 1}
			<div in:fly={{ y: -40, delay: start + 2000, duration: 800 }} class="mb-20">
				<h1 in:fade={{ duration: 300 }} class="mb-4 text-5xl font-bold">
					Welcome aboard, developer!
				</h1>
				<h2
					in:fade={{ delay: start + 2100, duration: 300 }}
					class="mb-4 pl-2 font-medium text-primary/90"
				>
					Register your very first account and initiate UniCourse Realm.
				</h2>
				<div in:fade={{ delay: start + 2300, duration: 300 }} class="input-group">
					<input
						placeholder="Enter Username"
						class="input bg-white/70 placeholder:text-sm placeholder:font-semibold placeholder:text-gray-500 focus:outline-none"
						bind:value={username}
					/>
					<span class="bg-white/70 text-sm font-semibold lowercase text-primary">as</span>
					<div class="dropdown-start dropdown-left dropdown">
						<button
							tabindex="0"
							class="btn-ghost btn rounded-none bg-white/70 normal-case focus:outline-none"
							class:text-gray-500={roles.length === 0}
							>{roles.join(", ") || "Select Roles"}</button
						>
						<button tabindex="0" class="dropdown-content rounded-box w-48 bg-white p-4">
							{#each roleOptions as role}
								<label class="label cursor-pointer">
									<span class="label-text bg-transparent">{role}</span>
									<input
										type="checkbox"
										class="checkbox"
										bind:group={roles}
										value={role}
									/>
								</label>
							{/each}
						</button>
					</div>
					<button
						class="btn-primary btn"
						class:btn-disabled={!isComplete}
						on:click={getStarted}>Get Started</button
					>
				</div>
			</div>
		{/if}

		<div class="mb-10">
			<h1 in:fly={{ y: 40, delay: start, duration: 500 }} class="text-4xl">UniCourse</h1>
			<h1 in:fly={{ y: -20, delay: start + 500, duration: 600 }} class="text-8xl font-bold">
				Realm
			</h1>
		</div>

		<div
			in:fly={{ y: 10, delay: start + 1200, duration: 400 }}
			class="stats stats-vertical bg-white/70 shadow backdrop-blur-xl md:stats-horizontal"
		>
			<div class="stat">
				<div in:fade={{ delay: start + 1400, duration: 300 }} class="stat-title">
					{$t("home.total-courses")}
				</div>
				<div in:fly={{ y: -5, delay: start + 1400, duration: 300 }} class="stat-value">
					{commas(data.stats.courses)}
				</div>
				<div in:fade={{ delay: start + 1400, duration: 300 }} class="stat-desc">
					NTNU, NTU, NTUST, FCU, ...
				</div>
			</div>
			<div class="stat">
				<div in:fade={{ delay: start + 1500, duration: 300 }} class="stat-title">
					{$t("home.total-posts")}
				</div>
				<div in:fly={{ y: -5, delay: start + 1500, duration: 300 }} class="stat-value">
					{commas(data.stats.posts)}
				</div>
				<div in:fade={{ delay: start + 1500, duration: 300 }} class="stat-desc">
					{$t("home.featured", { values: { title: "How to use UniCourse?" } })}
				</div>
			</div>
			<div class="stat">
				<div in:fade={{ delay: start + 1600, duration: 300 }} class="stat-title">
					{$t("home.active-users")}
				</div>
				<div in:fly={{ y: -5, delay: start + 1600, duration: 300 }} class="stat-value">
					{commas(data.stats.users)}
				</div>
				<div in:fade={{ delay: start + 1600, duration: 300 }} class="stat-desc">
					{$t("home.from-over-n-schools", { values: { n: 32 } })}
				</div>
			</div>
		</div>
	</div>
</section>
