import { db, ready } from "$lib/server/db";
import { convert } from "neo4j-ogm";
import { z } from "zod";

const CACHE_TTL = 1000 * 10;
const cache = new Map<string, [timer: NodeJS.Timer, data: unknown]>();

export async function discover(
	type: "Course" | "Instructor" | "Provider" | "Program",
	slug: string,
) {
	slug = z.string().min(1).parse(slug);

	const cached = cache.get(slug);
	if (cached) {
		return cached[1];
	}

	await ready;

	const { records } = await db.run(
		`
		MATCH (n:${type} {slug: $slug})
		OPTIONAL MATCH (n)-[t]->(to:Provider|Instructor|Program|Course)
        OPTIONAL MATCH (n)<-[f]-(from:Provider|Instructor|Program|Course)
		RETURN n, collect(DISTINCT to {.*, LABELS: labels(to)}) AS to, collect(DISTINCT from {.*, LABELS: labels(from)}) AS from`,
		{ slug },
	);

	if (records.length === 0) {
		throw new Error("Not found");
	}

	const node = records[0].get("n");
	const props = convert.js(node.properties);

	const to = records[0].get("to") as Record<string, any>[];
	const from = records[0].get("from") as Record<string, any>[];

	const result = {
		props,
		to: to.reduce((acc, node) => {
			if (!acc[node.LABELS[0]]) {
				acc[node.LABELS[0]] = [];
			}
			acc[node.LABELS[0]].push(convert.js(node));
			return acc;
		}, {} as Record<string, { type: string; props: unknown }[]>),
		from: from.reduce((acc, node) => {
			if (!acc[node.LABELS[0]]) {
				acc[node.LABELS[0]] = [];
			}

			acc[node.LABELS[0]].push(convert.js(node));
			return acc;
		}, {} as Record<string, { type: string; props: unknown }[]>),
	};

	cache.set(slug, [setTimeout(() => cache.delete(slug), CACHE_TTL), result]);

	return result;
}
