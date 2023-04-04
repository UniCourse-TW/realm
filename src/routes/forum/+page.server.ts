import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.crystal) {
		throw redirect(307, "/auth");
	}
};

// export const load: PageServerLoad = async () => {
// 	throw redirect(301, "/forum/search");
// };
