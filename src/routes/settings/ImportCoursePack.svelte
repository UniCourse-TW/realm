<script lang="ts">
	import { Event } from "$lib/event";
	import { t } from "svelte-i18n";
	import { fly } from "svelte/transition";

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

<div
	transition:fly={{ y: 50, delay: 500, duration: 500 }}
	class="card my-8 bg-base-100 p-4 shadow-lg md:p-8"
>
	<div class="flex flex-col">
		<div>
			<h1 class="text-2xl">{$t("me.import-course-pack")}</h1>
			<p class="py-4">{$t("me.upload-a-course-pack-to-import-it-into-the-system")}</p>
		</div>

		<div>
			<div class="form-control w-full">
				<label class="label" for="select-course-pack">
					<span class="label-text">{$t("me.pick-a-course-pack")}</span>
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
						{$t("import")}
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
