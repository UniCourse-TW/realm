import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.crystal) {
		throw redirect(307, "/auth");
	}

	const res = await fetch("/api/auth/invitation/my");
	const json = await res.json();

	return {
		invitations: json.data,
	};
};
