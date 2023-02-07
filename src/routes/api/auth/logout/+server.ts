import { en } from "$lib/strings";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	cookies.delete("crystal", { path: "/" });

	return json({
		data: {},
	});
};
