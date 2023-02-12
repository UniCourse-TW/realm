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
			description = `UniCourse Realm Course: ${
				course.data.props.description || course.data.props.name || "Course Not Found"
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
