<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { Event } from "$lib/event";
	import type { ClientUser } from "$lib/types";
	import { fly } from "svelte/transition";
	import Icon from "@iconify/svelte";

	export let data: {
		user: ClientUser;
	};

	const is_gmail = data.user.email.endsWith("@gmail.com");

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

	let import_progress = -1;
	let import_files: FileList | null = null;
	async function import_course_pack() {
		if (!import_files) {
			return;
		}

		import_progress = 0;
		await new Promise((resolve) => setTimeout(resolve, 100));

		try {
			const text = JSON.stringify(JSON.parse(await import_files[0].text()));

			const res = await fetch("/api/course-pack/import", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: text,
			});

			const { data } = await res.json();
			if (!data?.event) {
				throw new Error("Task not found");
			}

			const evt = Event.get<{ progress: number }>(data.event);
			evt.listen((data) => {
				console.log(data);
				if (data.type === "progress") {
					import_progress = data.progress;
				}
				if (data.progress === 100) {
					import_progress = -1;
				}
			});
		} catch (err) {
			console.error(err);
			import_progress = -1;
		}
	}
</script>

<svelte:head>
	<title>Me</title>
</svelte:head>

<section class="pt-12">
	{#if !data.user.roles.includes("Verified")}
		<div class="alert bg-base-100 text-sm shadow-lg" transition:fly={{ y: 50, duration: 500 }}>
			<div>
				<span>
					<Icon
						icon="mdi:alert-circle-outline"
						class="mb-0.5 mr-1 hidden text-3xl md:inline"
					/>
					Verify your account by confirming email
					{#if is_gmail}
						<a
							href="https://mail.google.com/mail/u/0/#search/unicourse"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-ghost btn-sm btn px-2 normal-case"
						>
							{data.user.email}
							<Icon icon="mdi:open-in-new" class="ml-1 inline text-xl" />
						</a>
					{:else}
						{data.user.email}
					{/if}
				</span>
			</div>
		</div>
	{/if}

	<div
		transition:fly={{ y: 50, delay: 200, duration: 500 }}
		class="card my-8 bg-base-100 p-4 shadow-lg md:p-8"
	>
		<div class="flex flex-col lg:flex-row">
			<div>
				<h1 class="text-2xl font-bold md:text-3xl lg:text-4xl">
					Nice to see you, <wbr />
					{data.user.name || data.user.username}!
				</h1>
				<p class="prose py-4 md:py-6">
					You are logged in as <span class="font-bold">{data.user.username}</span>. <br />
					Roles: <span class="font-bold">{data.user.roles.join(", ")}</span>.
				</p>
				<button class="btn-outline btn-error btn" on:click={logout} disabled={logging_out}>
					Logout
				</button>
			</div>
		</div>
	</div>

	{#if data.user.roles.includes("CoursePacker")}
		<div
			transition:fly={{ y: 50, delay: 500, duration: 500 }}
			class="card my-8 bg-base-100 p-4 shadow-lg md:p-8"
		>
			<div class="flex flex-col">
				<div>
					<h1 class="text-2xl">Import Course Pack</h1>
					<p class="py-4">Upload a course pack to import it into the system.</p>
				</div>

				<div>
					<div class="form-control w-full">
						<label class="label" for="select-course-pack">
							<span class="label-text">Pick a Course Pack</span>
						</label>
						<input
							id="select-course-pack"
							type="file"
							class="file-input-bordered file-input w-full"
							accept=".json"
							bind:files={import_files}
						/>
						<label class="label" for="select-course-pack">
							<span class="label-text" />
							<span class="label-text-alt">*.json</span>
						</label>

						{#if import_files?.length === 1}
							<button
								class="btn-primary btn"
								disabled={import_progress >= 0}
								on:click={import_course_pack}
							>
								Import
							</button>
						{/if}

						{#if import_progress >= 0}
							<progress
								class="progress progress-primary my-2 w-full"
								value={import_progress}
								max="100"
							/>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</section>
