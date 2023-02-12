<script lang="ts">
	import { t } from "svelte-i18n";

	export let user: { username: string } | null;
</script>

<header
	class="group fixed top-0 left-0 z-10 flex h-6 w-full items-center justify-between gap-2 overflow-hidden backdrop-blur-lg transition-all hover:h-16"
>
	<div
		class="absolute inset-0 bg-gradient-to-r from-blue-300 via-indigo-200 to-fuchsia-200 opacity-40 transition-all group-hover:opacity-70"
	/>
	<div class="flex items-center gap-2 pl-2">
		<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/">
			UniCourse<sapn class="ml-1 hidden sm:inline">Realm</sapn>
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
			<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/auth"
				>{$t("nav.login")}</a
			>
		{:else}
			<a class="btn-ghost btn-sm btn normal-case group-hover:h-12" href="/me"
				>{$t("nav.me")}</a
			>
		{/if}
	</div>
</header>
