import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.crystal) {
		throw redirect(307, "/auth");
	}

	const self: {
		username: string;
		roles: string[];
		email: string;
		avatar: string | undefined;
		intro: string;
		schools: string;
		contacts: { type: string; value: string }[];
	} = (await fetch("/api/auth/self").then((r) => r.json())).data;

	return {
		self,
	};
};
