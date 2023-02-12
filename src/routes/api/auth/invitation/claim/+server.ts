import { Role } from "$lib/constants";
import { db, ready } from "$lib/server/db";
import { ok, error } from "$lib/server/respond";
import { en } from "$lib/strings";
import { convert } from "neo4j-ogm";
import { createId } from "@paralleldrive/cuid2";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.crystal?.roles.includes(Role.User)) {
		return error(en.auth.permission_denied, 403);
	}

	await ready;

	const result = await db.run(
		`
		MATCH (x:User {username: $username})<-[:OWNED_BY]-(invitation:Invitation)
		RETURN invitation
		ORDER BY invitation.created DESC
		LIMIT 1`,
		{ username: locals.crystal.username },
	);

	const invitation = result.records[0]?.get("invitation");
	const last = convert.js(invitation?.properties.created);
	const now = new Date();

	if (now.getTime() - last.getTime() > 1000 * 60 * 60 * 24) {
		const code = createId();
		const result = await db.run(
			`
			MATCH (x:User {username: $username})
			MERGE (x)<-[:OWNED_BY]-(invitation:Invitation { code: $code, created: datetime(), revoked: false })
			RETURN invitation`,
			{ username: locals.crystal.username, code },
		);

		const invitation = result.records[0]?.get("invitation");
		const last = convert.js(invitation?.properties.created);
		const now = new Date();

		return ok({
			code,
			next: last.getTime() + 1000 * 60 * 60 * 24 - now.getTime(),
		});
	}

	return ok({
		next: last.getTime() + 1000 * 60 * 60 * 24 - now.getTime(),
	});
};
