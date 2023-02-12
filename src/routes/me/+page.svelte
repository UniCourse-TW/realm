<script lang="ts">
	import { Role } from "$lib/constants";
	import type { ClientUser } from "$lib/types";
	import ImportCoursePack from "./ImportCoursePack.svelte";
	import UserInfo from "./UserInfo.svelte";
	import VerifyEmail from "./VerifyEmail.svelte";

	export let data: {
		user: ClientUser;
	};
</script>

<svelte:head>
	<title>Me</title>
</svelte:head>

<section class="py-12">
	{#if !data.user.roles.includes(Role.Verified)}
		<VerifyEmail email={data.user.email} />
	{/if}

	<UserInfo user={data.user} />

	{#if data.user.roles.includes(Role.CoursePacker)}
		<ImportCoursePack />
	{/if}
</section>
