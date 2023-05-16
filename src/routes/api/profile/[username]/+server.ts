import { get_profile } from "$lib/server/profile";
import { en } from "$lib/strings";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	const profile = await get_profile(locals.crystal.username);
	return json({ data: profile });
};
