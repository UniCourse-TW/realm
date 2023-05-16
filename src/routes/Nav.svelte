<script lang="ts">
	import { avatar_url } from "$lib/profile";
	import type { Profile } from "$lib/server/profile";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	export let user: { username: string } | null;
	let profile: Promise<Profile> | null = null;
	onMount(async () => {
		if (user == null) return;
		profile = fetch(`/api/profile/${user.username}`)
			.then((r) => r.json())
			.then((j) => j.data);
	});
</script>

<header
	class="group fixed top-0 left-0 z-10 flex h-6 w-full items-center justify-between gap-2 backdrop-blur-lg transition-all hover:h-16"
>
	<div
		class="absolute inset-0 bg-gradient-to-r from-blue-300 via-indigo-200 to-fuchsia-200 opacity-40 transition-all group-hover:opacity-70"
	/>
	<div class="flex items-center gap-2 pl-2">
		<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/">
			UniCourse<span class="ml-1 hidden sm:inline">Realm</span>
		</a>
	</div>
	<div class="flex items-center gap-2 pr-2">
		<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/course/search"
			>{$t("nav.course")}</a
		>
		<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/forum"
			>{$t("nav.forum")}</a
		>
		{#if !user}
			<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/auth">
				{$t("nav.login")}
			</a>
		{:else}
			<div class="dropdown-end dropdown">
				<div tabindex="0" class="btn-ghost btn-sm btn normal-case group-hover:h-12">
					{$t("nav.me")}
				</div>
				<ul class="dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow">
					<li>
						<a href="/@{user.username}">
							{$t("nav.profile")}
						</a>
					</li>
					<li>
						<a href="/settings">
							{$t("nav.settings")}
						</a>
					</li>
					<li>
						<a href="/settings/profile">
							{$t("nav.profile-settings")}
						</a>
					</li>
				</ul>
			</div>
		{/if}
	</div>
</header>
