import { db, ready } from "$lib/server/db";
import type { Integer } from "neo4j-driver";
import { convert } from "neo4j-ogm";
import { z } from "zod";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const slug = z.string().min(1).parse(params.slug);

	await ready;

	const { records } = await db.run(
		`
        MATCH (rt:Rating)-[:ABOUT]->(c:Course {slug: $slug})
        WITH count(rt) AS cnt,
            [i IN range(1, 5) | COUNT { (rt) WHERE rt.usefulness = i }] AS usefulness,
            [i IN range(1, 5) | COUNT { (rt) WHERE rt.sweetness = i }] AS sweetness,
            [i IN range(1, 5) | COUNT { (rt) WHERE rt.easiness = i }] AS easiness
        RETURN cnt, usefulness, sweetness, easiness`,
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

	const count: bigint = convert.js(records[0].get("cnt") || 0n);
	const usefulness: bigint[] = (records[0].get("usefulness") as Integer[]).map(
		(e) => convert.js(e) || 0n,
	);
	const sweetness: bigint[] = (records[0].get("sweetness") as Integer[]).map(
		(e) => convert.js(e) || 0n,
	);
	const easiness: bigint[] = (records[0].get("easiness") as Integer[]).map(
		(e) => convert.js(e) || 0n,
	);

	return json({
		data: {
			count: Number(count),
			usefulness: usefulness.map(Number),
			sweetness: sweetness.map(Number),
			easiness: easiness.map(Number),
		},
	});
};
