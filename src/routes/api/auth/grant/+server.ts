import { Role } from "$lib/constants";
import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.crystal?.roles.includes(Role.Moderator)) {
		return json({ error: en.auth.permission_denied }, { status: 403 });
	}
	await ready;

	const username = url.searchParams.get("username");
	const role = url.searchParams.get("role");

	const valid: string[] = [Role.Moderator, Role.Verified, Role.CoursePacker];

	if (!username || !role || !valid.includes(role)) {
		return json({ error: en.data.invalid }, { status: 400 });
	}

	const result = await db.run(
		`MATCH (x:User {username: $username}) SET x:${role} RETURN labels(x) as roles`,
		{ username },
	);

	const roles = result.records[0].get("roles") as string[];

	return json({ data: { username, roles } });
};
