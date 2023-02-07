import { dev } from "$app/environment";
import { JWT_SECRET } from "$lib/server/config";
import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import { verify } from "argon2";
import * as JWT from "jsonwebtoken";
import { createId } from "@paralleldrive/cuid2";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { v } from "@unicourse-tw/validation";

export const POST: RequestHandler = async ({ request, cookies }) => {
	await ready;

	let { username, password } = await request.json();

	try {
		username = v.username.parse(username);
	} catch {
		return json({ error: en.auth.username_invalid }, { status: 400 });
	}

	try {
		password = v.password.parse(password);
	} catch {
		return json({ error: en.auth.password_invalid }, { status: 400 });
	}

	if (!(await check_password(username, password))) {
		return json({ error: en.auth.wrong_password }, { status: 400 });
	}

	const { records } = await db.run(
		`MATCH (user:User { username: $username }) RETURN labels(user) AS labels`,
		{ username },
	);

	const labels = records[0].get("labels") as string[];

	const payload = {
		id: createId(),
		username: username,
		expires: Date.now() + 1000 * 60 * 60,
		roles: labels,
	};

	const jwt = JWT.sign(payload, JWT_SECRET, {
		expiresIn: "1h",
	});

	await db.run(
		`MATCH (user:User { username: $username }) CREATE (token:Token $token)-[:OWNED_BY]->(user)`,
		{ username, token: payload },
	);

	cookies.set("crystal", jwt, {
		path: "/",
		maxAge: 60 * 60,
		httpOnly: true,
		sameSite: "lax",
		secure: !dev,
	});

	return json({
		data: {
			username,
		},
	});
};

async function check_password(username: string, password: string): Promise<boolean> {
	const { records } = await db.run(
		`MATCH (user:User { username: $username }) RETURN user.password AS password`,
		{ username },
	);

	const user = records[0]?.get("password") as string | undefined;
	if (!user) {
		return false;
	}
	return await verify(user, password);
}
