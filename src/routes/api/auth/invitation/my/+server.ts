import { Role } from "$lib/constants";
import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import { convert } from "neo4j-ogm";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.crystal?.roles.includes(Role.User)) {
		return json({ error: en.auth.permission_denied }, { status: 403 });
	}

	await ready;

	const result = await db.run(
		`
		MATCH (x:User {username: $username})<-[:OWNED_BY]-(invitation:Invitation)
		OPTIONAL MATCH (invitation)-[r:USED_BY]->(other:User)
		RETURN invitation, other.username as user, r.at as at`,
		{ username: locals.crystal.username },
	);

	return json({
		data: result.records.map((record) => ({
			invitation: convert.js(record.get("invitation").properties),
			user: record.get("user"),
			at: +convert.js(record.get("at")),
		})),
	});
};
