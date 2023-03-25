import { FIRST_INVITATION_CODE } from "$lib/server/config";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch("/api/stats");
	const { data: stats } = await response.json();
	return { stats, code: FIRST_INVITATION_CODE };
};
