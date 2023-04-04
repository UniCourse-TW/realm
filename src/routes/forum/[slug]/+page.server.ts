import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { slug } = params;

	const res = await fetch(`/api/forum/${slug}`);
	const forum = await res.json();

	if (forum.data) {
		return forum.data;
	} else {
		throw error(404, { message: "Not found" });
	}
};
