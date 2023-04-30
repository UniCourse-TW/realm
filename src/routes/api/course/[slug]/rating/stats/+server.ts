import { db, ready } from "$lib/server/db";
import { z } from "zod";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const slug = z.string().min(1).parse(params.slug);

	await ready;

	const { records } = await db.run(
		`
        MATCH (rt:Rating)-[:ABOUT]->(c:Course {slug: $slug})
        WITH count(rt) AS cnt,
            [i IN range(1, 5) | COUNT { (r:Rating) WHERE r.usefulness = i }] AS usefulness,
            [i IN range(1, 5) | COUNT { (r:Rating) WHERE r.sweetness = i }] AS sweetness,
            [i IN range(1, 5) | COUNT { (r:Rating) WHERE r.easiness = i }] AS easiness
        RETURN {
            count: cnt,
            usefulness: usefulness,
            sweetness: sweetness,
            easiness: easiness
        }`,
		{ slug },
	);
	if (records.length === 0) {
		return json({
			data: {
				count: 0,
				usefulness: [0, 0, 0, 0, 0],
				sweetness: [0, 0, 0, 0, 0],
				easiness: [0, 0, 0, 0, 0],
			},
		});
	}

	return json({ data: records[0] });
};
