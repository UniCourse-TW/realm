import { JWT_SECRET } from "$lib/server/config";
import { db } from "$lib/server/db";
import * as JWT from "jsonwebtoken";
import { z } from "zod";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const jwt = params.jwt;
	if (!jwt) {
		throw error(400, "No token provided");
	}

	let decoded: { username: string; email: string };
	try {
		decoded = z
			.object({
				username: z.string(),
				email: z.string(),
			})
			.parse(JWT.verify(jwt, JWT_SECRET));
	} catch (e) {
		throw error(400, "Invalid token");
	}

	const result = await db.run(
		`MATCH (user:User { username: $username, email: $email })
		SET user:Verified
		RETURN user`,
		decoded,
	);

	if (!result.records[0].get("user").labels.includes("Verified")) {
		throw error(400, "Verification failed");
	}

	return new Response("Verification successful. You may need to re-login to see the changes.");
};
