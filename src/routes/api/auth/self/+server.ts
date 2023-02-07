import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import { convert } from "neo4j-ogm";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	await ready;
	const { records } = await db.run(
		`
		MATCH (user:User { username: $username })
		OPTIONAL MATCH (user)-[:MEMBER_OF]->(school:Provider)
		RETURN user, collect(school.name) AS schools`,
		{ username: locals.crystal.username },
	);

	const user = convert.js(records[0].get("user").properties);
	const roles = records[0].get("user").labels;
	const schools = records[0].get("schools");

	return json({
		data: {
			username: user.username,
			roles,
			email: user.email,
			avatar: user.avatar,
			intro: user.intro,
			schools,
		},
	});
};
