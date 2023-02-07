import pkg from "$lib/server/meta";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	return json({
		data: {
			server: pkg.name,
			version: pkg.version,
		},
	});
};
