import type { ClientUser } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
	let user: ClientUser | null = null;

	if (locals.crystal) {
		const result = await fetch("/api/auth/self").then((r) => r.json());
		if (result.error) {
			throw new Error(result.error);
		}
		user = result.data;
	}

	return {
		user,
	};
};
