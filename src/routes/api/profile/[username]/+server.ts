import { get_profile } from "$lib/server/profile";
import { error } from "$lib/server/respond";
import { en } from "$lib/strings";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	const username = params.username;

	if (username === undefined) {
		return error(en.profile.invalid_data, 400);
	}

	const profile = await get_profile(username);
	return json({ data: profile });
};
