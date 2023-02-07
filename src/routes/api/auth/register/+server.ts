import { dev } from "$app/environment";
import { JWT_SECRET } from "$lib/server/config";
import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import { hash } from "argon2";
import * as JWT from "jsonwebtoken";
import { convert } from "neo4j-ogm";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { v } from "@unicourse-tw/validation";

export const POST: RequestHandler = async ({ request, cookies }) => {
	await ready;

	let { username, password, email, invitation } = await request.json();

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

	try {
		email = v.email.parse(email);
	} catch {
		return json({ error: en.auth.email_invalid }, { status: 400 });
	}

	try {
		invitation = z.string().parse(invitation);
	} catch {
		return json({ error: en.auth.invitation_invalid }, { status: 400 });
	}

	const payload = {
		id: createId(),
		username: username,
		expires: Date.now() + 1000 * 60 * 60,
		roles: ["User"],
	};

	const jwt = JWT.sign(payload, JWT_SECRET, {
		expiresIn: "1h",
	});

	try {
		const { records } = await db.run(
			`
        MATCH (invitation:Invitation { code: $invitation })-[:OWNED_BY]->(owner:User)
        WHERE NOT (invitation)-[:USED_BY]->(:User)
        WITH invitation, owner
		CREATE (user:User $user)
        MERGE (invitation)-[:USED_BY { at: datetime() }]->(user)
        WITH user, owner
        CREATE (user)-[:FOLLOWS]->(owner)
        CREATE (token:Token $token)-[:OWNED_BY]->(user)
        RETURN user, owner.username as referrer
        `,
			{
				user: {
					username,
					password: await hash(password),
					email,
				},
				invitation,
				token: payload,
			},
		);

		const user = convert.js(records[0].get("user"));
		const referrer = records[0].get("referrer") as string;

		cookies.set("crystal", jwt, {
			path: "/",
			maxAge: 60 * 60,
			httpOnly: true,
			sameSite: "lax",
			secure: !dev,
		});

		return json({
			data: {
				username: user.username,
				referrer,
			},
		});
	} catch (err) {
		return json({ error: en.auth.wrong_invitation }, { status: 400 });
	}
};
