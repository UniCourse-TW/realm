import { JWT_SECRET } from "$lib/server/config";
import { db } from "$lib/server/db";
import { send } from "$lib/server/email";
import { en } from "$lib/strings";
import * as JWT from "jsonwebtoken";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	const result = await db.run(`MATCH (user:User { username: $username }) RETURN user`, {
		username: locals.crystal.username,
	});

	const email = result.records[0].get("user").properties.email;

	const jwt = JWT.sign({ username: locals.crystal.username, email }, JWT_SECRET, {
		expiresIn: "10m",
	});

	const callback = new URL(
		"/api/auth/verify",
		request.headers.get("referer") ?? "https://unicourse.tw",
	);

	await send(
		[email],
		"Verify your email",
		`Click <a href="${callback}/${jwt}">here</a> to verify your email.`,
	);

	return json({ email });
};
