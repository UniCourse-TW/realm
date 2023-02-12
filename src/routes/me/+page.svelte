<script lang="ts">
	import { Role } from "$lib/constants";
	import type { ClientUser } from "$lib/types";
	import { t } from "svelte-i18n";
	import ImportCoursePack from "./ImportCoursePack.svelte";
	import Management from "./Management.svelte";
	import UserInfo from "./UserInfo.svelte";
	import VerifyEmail from "./VerifyEmail.svelte";

	export let data: {
		user: ClientUser;
	};
</script>

<svelte:head>
	<title>{$t("nav.me")}</title>
</svelte:head>

<section class="py-12">
	{#if !data.user.roles.includes(Role.Verified)}
		<VerifyEmail email={data.user.email} />
	{/if}

	<UserInfo user={data.user} />

	{#if data.user.roles.includes(Role.CoursePacker)}
		<ImportCoursePack />
	{/if}

	{#if data.user.roles.includes(Role.Moderator)}
		<Management />
	{/if}
</section>
