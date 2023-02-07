import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch("/api/stats");
	const { data: stats } = await response.json();
	return { stats };
};
