<script lang="ts">
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

<section class="pt-12">
	{#if !data.user.roles.includes("Verified")}
		<VerifyEmail email={data.user.email} />
	{/if}

	<UserInfo user={data.user} />

	{#if data.user.roles.includes("CoursePacker")}
		<ImportCoursePack />
	{/if}
</section>
