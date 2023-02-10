import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, fetch, params, url }) => {
	if (!locals.crystal) {
		throw redirect(307, "/auth");
	}

	const query = params.query;
	const page = Number(url.searchParams.get("page")) || 1;
	const types = url.searchParams.get("types") || "course,instructor,program,provider";
	const order = url.searchParams.get("order") || "relevance";
	const dir = url.searchParams.get("dir") || (order === "relevance" ? "desc" : "asc");

	try {
		const response = await fetch(
			`/api/course?q=${query}&page=${page}&types=${types}&order=${order}&dir=${dir}`,
		);
		const result = await response.json();
		return { result: result.data };
	} catch {
		throw redirect(301, "/course/search");
	}
};
