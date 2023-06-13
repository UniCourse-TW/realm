import { ok } from "$lib/server/respond";
import { en } from "$lib/strings";
import { json } from "@sveltejs/kit";
import { get_ratings } from ".";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	try {
		return ok(await get_ratings(params.username));
	} catch (error) {
		console.log(error);
		return json({ error: en.exception }, { status: 500 });
	}
};
