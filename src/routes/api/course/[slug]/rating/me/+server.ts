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

	const slug = z.string().min(1).parse(params.slug);

	try {
		let result;
		result = await db.run(
			`
			MATCH (u:User {username: $username}), (c:Course {slug: $slug})
			MATCH (u)<-[:RATE_BY]-(rating:Rating)-[:ABOUT]->(c)
			RETURN rating`,
			{ slug, username: locals.crystal.username },
		);
		const rating = result.records[0]?.get("rating");
		if (!rating) {
			return json({ error: en.data.not_found }, { status: 404 });
		}

		const resp = {
			usefulness: convert.js(rating.properties.usefulness),
			sweetness: convert.js(rating.properties.sweetness),
			easiness: convert.js(rating.properties.easiness),
			comment: null,
		};
		result = await db.run(
			`
			MATCH (u:User {username: $username})
			MATCH (u)<-[:WRITE_BY]-(post:Post)<-[:LINK]->(r:Rating {id: $r})
			RETURN post`,
			{ username: locals.crystal.username, r: rating.identity },
		);
		const post = result.records[0]?.get("post");
		if (post) {
			resp.comment = post.properties.content;
		}
		return ok(resp);
	} catch (error) {
		return json({ error: en.exception }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	const slug = z.string().min(1).parse(params.slug);

	let payload, r_id;
	try {
		payload = z
			.object({
				usefulness: z.number().int().min(1).max(5),
				sweetness: z.number().int().min(1).max(5),
				easiness: z.number().int().min(1).max(5),
				comment: z.string().max(65535),
			})
			.parse(await request.json());
	} catch (error) {
		return json({ error: en.data.invalid }, { status: 400 });
	}

	await ready;

	try {
		const { records } = await db.run(
			`
            MATCH (c:Course {slug: $slug}), (u:User {username: $username})
			MERGE (u)<-[:RATE_BY]-(r:Rating)-[:ABOUT]->(c)
			SET r.usefulness = $usefulness, r.sweetness = $sweetness, r.easiness = $easiness, r.timestamp = datetime()
			RETURN ID(r) AS r_id
            `,
			{ slug, ...payload, username: locals.crystal.username },
		);
		r_id = records[0].get("r_id");
		if (payload.comment.length > 0) {
			await db.run(
				`
                MATCH (r:Rating {id: $r_id}), (u:User {username: $username})
				MERGE (u)<-[:WRITE_BY]-(p:Post)<-[:LINK]->(r)
				SET p.content = $comment`,
				{
					r_id,
					username: locals.crystal.username,
					comment: payload.comment,
				},
			);
		}
	} catch (error) {
		return json({ error: en.exception }, { status: 500 });
	}

	return ok(r_id);
};
