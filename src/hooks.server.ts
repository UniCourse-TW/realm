import { JWT_SECRET } from "$lib/server/config";
import * as JWT from "jsonwebtoken";
import type { Handle } from "@sveltejs/kit";

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
			event.cookies.delete("crystal");
			return new Response("Unauthorized", { status: 401 });
		}
	}

	return resolve(event);
};
