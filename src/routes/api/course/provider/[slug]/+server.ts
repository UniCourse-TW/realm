import { ok, not_found } from "$lib/server/respond";
import { z } from "zod";
import type { RequestHandler } from "@sveltejs/kit";
import { discover } from "../../discover";

export const GET: RequestHandler = async ({ params }) => {
	const slug = z.string().min(1).parse(params.slug);
	try {
		return ok(await discover("Provider", slug));
	} catch (error) {
		if (error instanceof Error && error.message === "Not found") {
			return not_found();
		}
		throw error;
	}
};
