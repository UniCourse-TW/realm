import { JWT_SECRET } from "$lib/server/config";
import debug from "debug";
import * as JWT from "jsonwebtoken";
import { locale } from "svelte-i18n";
import type { Handle } from "@sveltejs/kit";

const log = debug("server");

export const handle: Handle = async ({ event, resolve }) => {
	const crystal = event.cookies.get("crystal");

	if (crystal) {
		try {
			const payload = JWT.verify(crystal, JWT_SECRET) as {
				id: string;
				username: string;
				expires: number;
				roles: string[];
			};
			event.locals.crystal = payload;
		} catch {
			event.cookies.delete("crystal", { path: "/" });
			return new Response("Unauthorized", { status: 401 });
		}
	}

	const lang = event.request.headers.get("accept-language")?.split(",")[0];
	if (lang) {
		locale.set(lang);
	}

	const process_start = Date.now();
	const result = await resolve(event);
	const process_end = Date.now();

	log(
		`${event.request.method} ${event.request.url} ${result.status} ${
			process_end - process_start
		}ms`,
	);
	return result;
};

process.on("SIGINT", () => {
	process.exit(0);
});

process.on("SIGTERM", () => {
	process.exit(0);
});
