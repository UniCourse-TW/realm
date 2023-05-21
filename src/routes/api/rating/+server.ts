import { db, ready } from "$lib/server/db";
import { ok } from "$lib/server/respond";
import { en } from "$lib/strings";
import { convert } from "neo4j-ogm";
import { z } from "zod";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	try {
		const { records } = await db.run(
			`
			MATCH (u:User {username: $username}), (c:Course)
			MATCH (u)<-[:RATE_BY]-(r:Rating)-[:ABOUT]->(c)
            OPTIONAL MATCH (post:Post)-[:LINK]->(r)
			RETURN r, c.slug as slug, post.content AS comment`,
			{ username: locals.crystal.username },
		);
		const ratings = records.map((record) => {
			const rating = record.get("r");
			return {
				created: new Date(convert.js(rating.properties.created)),
				id: Number(convert.js(rating.identity)),
				comment: record.get("comment"),
				slug: record.get("slug"),
				usefulness: Number(convert.js(rating.properties.usefulness)),
				sweetness: Number(convert.js(rating.properties.sweetness)),
				easiness: Number(convert.js(rating.properties.easiness)),
			};
		});
		return ok(ratings);
	} catch (error) {
		console.log(error);
		return json({ error: en.exception }, { status: 500 });
	}
};
