import { get_profile } from "$lib/server/profile";
import { redirect } from "@sveltejs/kit";
import { get_ratings } from "../api/rating/[username]";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.crystal) {
		throw redirect(307, "/auth");
	}

	const profile = await get_profile(params.username);
	const favoriteCourses: Record<string, any>[] = [];
	const bookmarkedCourses: Record<string, any>[] = [];
	let comments = await get_ratings(params.username);
	comments.sort((a, b) => b.created.getTime() - a.created.getTime());
	comments = comments.slice(0, 5);

	return {
		profile,
		favoriteCourses,
		bookmarkedCourses,
		comments,
	};
};
