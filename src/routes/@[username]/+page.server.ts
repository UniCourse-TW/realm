import type { Profile } from "$lib/server/profile";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
	if (!locals.crystal) {
		throw redirect(307, "/auth");
	}

	const profile: Profile = (await fetch(`/api/profile/${params.username}`).then((r) => r.json()))
		.data;
	const favoriteCourses: Record<string, any>[] = [];
	const bookmarkedCourses: Record<string, any>[] = [];

	return {
		profile,
		favoriteCourses,
		bookmarkedCourses,
		comments: [],
	};
};
