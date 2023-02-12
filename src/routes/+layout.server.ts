import type { ClientUser } from "$lib/types";
import { t } from "svelte-i18n";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, fetch, route, params }) => {
	let user: ClientUser | null = null;

	if (locals.crystal) {
		const result = await fetch("/api/auth/self").then((r) => r.json());
		if (result.error) {
			throw new Error(result.error);
		}
		user = result.data;
	}

	let title = "UniCourse Realm";
	let description =
		"UniCourse Realm is a free, open-source, and community-driven course catalog.";

	if (route.id === "/course/[slug]") {
		const { slug } = params;
		const res = await fetch(`/api/course/${slug}`);
		const course = await res.json();
		if (course.data) {
			title = course.data.props.name || "404";
			description = `UniCourse Realm Course Search: ${
				course.data.props.description || course.data.props.name || "Course Not Found"
			}`;
		}
	} else if (route.id === "/course/search/[query]") {
		const { query } = params;
		title = (await val("course.search-courses")) + `: ${query}`;
		description = `UniCourse Realm Course Search: ${query}`;
	} else if (route.id === "/course/instructor/[slug]") {
		const { slug } = params;
		const res = await fetch(`/api/course/instructor/${slug}`);
		const instructor = await res.json();
		if (instructor.data) {
			title = instructor.data.props.name || "404";
			description = `UniCourse Realm Course Search: Instructor ${
				instructor.data.props.name || "Instructor Not Found"
			}`;
		}
	} else if (route.id === "/course/provider/[slug]") {
		const { slug } = params;
		const res = await fetch(`/api/course/provider/${slug}`);
		const provider = await res.json();
		if (provider.data) {
			title = provider.data.props.name || "404";
			description = `UniCourse Realm Course Search: Provider ${
				provider.data.props.name || "Provider Not Found"
			}`;
		}
	} else if (route.id === "/course/program/[slug]") {
		const { slug } = params;
		const res = await fetch(`/api/course/program/${slug}`);
		const program = await res.json();
		if (program.data) {
			title = program.data.props.name || "404";
			description = `UniCourse Realm Course Search: Program ${
				program.data.props.name || "Program Not Found"
			}`;
		}
	} else if (route.id === "/course/search") {
		title = await val("course.search-courses");
		description = "Find your interested courses on UniCourse";
	}

	return {
		user,
		head: {
			title,
			description,
		},
	};
};

function val(key: string): Promise<string> {
	return new Promise((resolve) => {
		const unsubscribe = t.subscribe((x) => {
			resolve(x(key));
			unsubscribe();
		});
	});
}
