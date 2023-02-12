<script lang="ts">
	import { Role } from "$lib/constants";
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";
	import ImportCoursePack from "./ImportCoursePack.svelte";
	import Invitations from "./Invitations.svelte";
	import Management from "./Management.svelte";
	import UserInfo from "./UserInfo.svelte";
	import VerifyEmail from "./VerifyEmail.svelte";

	export let data: PageData;
	const user = data.user!;
	const invitations = data.invitations!;
</script>

<svelte:head>
	<title>{$t("nav.me")}</title>
</svelte:head>

<section class="py-12">
	{#if !user.roles.includes(Role.Verified)}
		<VerifyEmail email={user.email} />
	{/if}

	<UserInfo {user} />

	<Invitations {invitations} />

	{#if user.roles.includes(Role.CoursePacker)}
		<ImportCoursePack />
	{/if}

	{#if user.roles.includes(Role.Moderator)}
		<Management />
	{/if}
</section>
