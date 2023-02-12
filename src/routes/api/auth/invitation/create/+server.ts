import { Role } from "$lib/constants";
import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import { createId } from "@paralleldrive/cuid2";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.crystal?.roles.includes(Role.Moderator)) {
		return json({ error: en.auth.permission_denied }, { status: 403 });
	}

	const code = createId();

	await ready;

	await db.run(
		`MATCH (x:User {username: $username}) MERGE (x)<-[:OWNED_BY]-(invitation:Invitation { code: $code, created: datetime(), revoked: false })`,
		{ username: locals.crystal.username, code },
	);

	return json({ data: { code } });
};
