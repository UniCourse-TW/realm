import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { slug } = params;

	const res = await fetch(`/api/course/program/${slug}`);
	const course = await res.json();

	if (course.data) {
		return course.data;
	} else {
		throw error(404, { message: "Not found" });
	}
};
