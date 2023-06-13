<script lang="ts">
	import Course from "$lib/components/Course.svelte";
	import { avatar_url, type_to_icon } from "$lib/profile";
	import { strip as _strip } from "$lib/utils";
	import Icon from "@iconify/svelte";

	export let data;

	async function get_course_name(slug: string): Promise<string> {
		const resp = await fetch(`/api/course/${slug}`).then((r) => r.json());
		return resp.data.props.name;
	}

	function strip(s: string): string {
		const SUMMARY_LENGTH = 72;
		return _strip(s, SUMMARY_LENGTH);
	}
</script>

<section class="py-12">
	<div class="card bg-base-100 p-8">
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center">
				<div class="avatar pr-4">
					<div class="w-24 rounded-full">
						<img src={avatar_url(data.profile.avatar)} alt="Avatar" />
					</div>
				</div>
				<div>
					<h1 class="text-2xl font-bold">{data.profile.username}</h1>
					<div class="flex flex-wrap">
						{#each data.profile.contacts as contact}
							<a href={contact.value} class="py-1 pr-4 md:py-0">
								<Icon class="inline" icon={type_to_icon(contact.type)} />
								<!-- <span class="text-gray-600">{contact.text}</span> -->
							</a>
						{/each}
					</div>
				</div>
			</div>
			<div>
				<!--
				TODO: follow user
				<button
					class="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-full mr-4"
				>
					Follow
				</button>
				-->
			</div>
		</div>

		<div class="mb-6">
			<p class="text-lg font-bold">Bio</p>
			{#if data.profile.intro}
				<p class="text-gray-600">{data.profile.intro}</p>
			{:else}
				<i class="text-gray-400">no content.</i>
			{/if}
		</div>

		<div class="mb-6">
			<div class="mb-3">
				<h3 class="text-lg font-bold">Favorite Course</h3>
			</div>
			<div class="md:grid md:grid-cols-2">
				{#if data.favoriteCourses.length > 0}
					{#each data.favoriteCourses as favoriteCourse}
						<Course props={favoriteCourse.props} />
					{/each}
				{:else}
					<i class="text-gray-400">no content.</i>
				{/if}
			</div>
		</div>

		<div class="mb-6 flex">
			<div class="flex-1">
				<div class="mb-3">
					<h3 class="text-md font-bold">Bookmarked</h3>
				</div>

				{#if data.bookmarkedCourses.length > 0}
					{#each data.bookmarkedCourses as bookmarkedCourse}
						<Course props={bookmarkedCourse.props} />
					{/each}
				{:else}
					<i class="text-gray-400">no content.</i>
				{/if}
			</div>

			<div class="flex-2">
				<div class="mb-3">
					<h3 class="text-md font-bold">Recently Comments</h3>
				</div>
				{#if data.comments.length > 0}
					{#each data.comments as comment}
						<div class="card py-2">
							<a class="card-title" href="/course/{comment.slug}">
								{#await get_course_name(comment.slug) then name}
									{name}
								{/await}
							</a>
							{#if comment.comment}
								{strip(comment.comment)}
							{:else}
								<i class="text-gray-400">no content.</i>
							{/if}
						</div>
					{/each}
				{:else}
					<i class="text-gray-400">no content.</i>
				{/if}
			</div>
		</div>
	</div>
</section>
