import { db, ready } from "$lib/server/db";
import { ok } from "$lib/server/respond";
import { en } from "$lib/strings";
import type { Integer } from "neo4j-driver";
import { convert } from "neo4j-ogm";
import { z } from "zod";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const slug = z.string().min(1).parse(params.slug);

	await ready;

	let data = [];
	try {
		const { records } = await db.run(
			`
            MATCH (r:Rating)-[:ABOUT]->(c:Course {slug: $slug})
            MATCH (r)-[:RATE_BY]->(u:User)
			OPTIONAL MATCH (r)<-[:LINK]-(p:Post)
            RETURN r, u, p.content as comment`,
			{ slug },
		);
		data = records.map((record) => {
			const r = record.get("r");
			const u = record.get("u");
			return {
				created: new Date(convert.js(r.properties.created)),
				id: Number(convert.js(r.identity)),
				comment: record.get("comment"),
				usefulness: Number(convert.js(r.properties.usefulness)),
				sweetness: Number(convert.js(r.properties.sweetness)),
				easiness: Number(convert.js(r.properties.easiness)),
				user: {
					id: Number(convert.js(u.identity)),
					username: u.properties.username,
				},
			};
		});
	} catch (error) {
		console.log(error);
		return json({ error: en.exception }, { status: 500 });
	}

	return ok(data);
};
