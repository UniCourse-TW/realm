<script lang="ts">
	import { goto } from "$app/navigation";
	import { avatar_url, type_to_icon } from "$lib/profile";
	import Icon from "@iconify/svelte";

	export let data;
	let avatar_files: FileList | null = null;

	$: if (avatar_files !== null && avatar_files.length > 0) {
		console.log(avatar_files);
	}

	const default_contact = {
		type: "facebook",
		value: "",
	};
	let last_contact = default_contact;

	let updating = false;
	async function update_profile() {
		if (updating) {
			return;
		}
		updating = true;

		try {
			let encodedAvatar = "";
			if (avatar_files !== null && avatar_files.length > 0) {
				console.log("base64 encode avatar file");
				const bytes = new Uint8Array(await avatar_files[0].arrayBuffer());
				let byteString = "";
				for (const b of bytes) {
					byteString += String.fromCharCode(b);
				}
				encodedAvatar = window.btoa(byteString);
			}

			const payload = {
				avatar: encodedAvatar,
				contacts: data.self.contacts,
				intro: data.self.intro,
			};
			const res = await fetch("/api/auth/self", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.status !== 200) {
				console.error(res);
			}

			await goto(`/@${data.user?.username}`, { invalidateAll: true });
		} catch (error) {
			console.error(error);
		} finally {
			updating = false;
		}
	}

	function add_contact() {
		data.self.contacts = [...data.self.contacts, { ...last_contact }];
		last_contact = { ...default_contact };
	}

	function remove_contact(index: number) {
		data.self.contacts.splice(index, 1);
		data.self.contacts = data.self.contacts;
	}
</script>

<section class="py-12">
	<div class="card bg-base-100 p-8">
		<div class="mb-6 flex flex-col justify-between">
			<div class="form-control py-2">
				<div class="flex gap-2 py-2">
					<div class="form-control flex-1 pr-8">
						<p class="pb-2">Introduction</p>
						<textarea
							rows="4"
							style="resize: none;"
							class="textarea-bordered textarea"
							placeholder="Intro"
							bind:value={data.self.intro}
						/>
					</div>
					<div>
						<p class="pb-2">Avatar</p>

						<label class="indicator hover:cursor-pointer" for="upload_avatar">
							<!-- TODO: button to delete avatar -->
							<!-- <span
								class="indicator-item indicator-bottom indicator-start badge badge-secondary"
								>Upload
							</span> -->
							<div class="avatar px-2">
								<div class="w-36 rounded-full">
									<img src={avatar_url(data.self.avatar)} alt="Avatar" />
								</div>
							</div>
							<input
								type="file"
								accept="image/png, image/jpeg"
								class="hidden"
								id="upload_avatar"
								bind:files={avatar_files}
							/>
						</label>
					</div>
				</div>
				<div class="py-2">
					<p class="pb-2">Contact</p>
					{#each data.self.contacts as contact, i}
						<div class="flex gap-2 py-1">
							<select class="select" bind:value={contact.type}>
								<option value="facebook"> facebook </option>
								<option value="github"> github </option>
							</select>
							<Icon class="m-auto text-2xl" icon={type_to_icon(contact.type)} />
							<input
								type="text"
								placeholder="type link here"
								class="text-input input flex-1"
								bind:value={contact.value}
							/>
							<button
								on:click={() => remove_contact(i)}
								class="btn-outline btn-square btn text-2xl"
							>
								-
							</button>
						</div>
					{/each}
					<div class="flex gap-2 py-1">
						<select class="select" bind:value={last_contact.type}>
							<option value="facebook"> facebook </option>
							<option value="github"> github </option>
						</select>
						<Icon class="m-auto text-2xl" icon={type_to_icon(last_contact.type)} />
						<input
							type="text"
							placeholder="type link here"
							class="text-input input flex-1"
							bind:value={last_contact.value}
						/>
						<button on:click={add_contact} class="btn-outline btn-square btn text-2xl">
							+
						</button>
					</div>
				</div>
				<div class="flex py-2">
					<div class="flex-1" />
					<button on:click={update_profile} disabled={updating} class="btn-primary btn"
						>Submit</button
					>
				</div>
			</div>
		</div>
	</div>
</section>
