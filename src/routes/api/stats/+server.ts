import { db, ready } from "$lib/server/db";
import { convert } from "neo4j-ogm";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	await ready;
	const { records } = await db.run(
		"CALL apoc.meta.stats() YIELD labels RETURN labels.User as users, labels.Post as posts, labels.Course as courses",
	);

	const courses: bigint = convert.js(records[0].get("courses") || 0n);
	const users: bigint = convert.js(records[0].get("users") || 0n);
	const posts: bigint = convert.js(records[0].get("posts") || 0n);

	const data = {
		courses: Number(courses),
		users: Number(users),
		posts: Number(posts),
	};

	return json({ data });
};
