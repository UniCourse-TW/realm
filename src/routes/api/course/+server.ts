import { Role } from "$lib/constants";
import { db, ready } from "$lib/server/db";
import { en } from "$lib/strings";
import { convert } from "neo4j-ogm";
import { z } from "zod";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

const CACHE_TTL = 1000 * 60;
const cache = new Map<string, [timer: NodeJS.Timer, data: unknown]>();

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.crystal?.roles.includes(Role.Verified)) {
		return json({ error: en.auth.permission_denied }, { status: 403 });
	}

	const query = z
		.string()
		.min(1)
		.parse(url.searchParams.get("q") || "資工系");
	const page = z
		.number()
		.int()
		.positive()
		.parse(Number(url.searchParams.get("page")) || 1);
	const types = labels(
		(url.searchParams.get("types") || "course,instructor,program,provider").split(","),
	);
	const order = sorting(url.searchParams.get("order") || "relevance");
	const dir = z
		.enum(["asc", "desc"])
		.parse(url.searchParams.get("dir") || (order[0] === "relevance" ? "desc" : "asc"))
		.toUpperCase();

	const offset = (page - 1) * 20;

	console.log({ query, offset });

	const cache_key = `${query}${offset}${types}${order[0]}${dir}`;
	const cached = cache.get(cache_key);
	if (cached) {
		return json({ data: cached[1] });
	}

	await ready;
	console.time(`query ${query}, offset ${offset}`);
	const { records } = await db.run(
		`
        CALL db.index.fulltext.queryNodes("COURSE_FTS", $query) YIELD node, score
        WHERE node:${types}
        WITH *
        SKIP toInteger($offset)
        LIMIT toInteger(20)
        OPTIONAL MATCH (node)-[t]->(to:Provider|Instructor|Program|Course)
        OPTIONAL MATCH (node)<-[f]-(from:Provider|Instructor|Program|Course)
        WITH node, score, collect(DISTINCT to {.*, LABELS: labels(to)}) AS to, collect(DISTINCT from {.*, LABELS: labels(from)}) AS from
        RETURN node, to, from, score
        ORDER BY COALESCE(${order[0]}, ${order[1]}) ${dir}
        `,
		{ query, offset },
	);
	console.timeEnd(`query ${query}, offset ${offset}`);
	console.log(records.length, "records");

	const data = records.map((record) => {
		const node = record.get("node");
		const to = record.get("to") as Record<string, any>[];
		const from = record.get("from") as Record<string, any>[];
		const score = record.get("score");

		return {
			type: node.labels[0],
			props: convert.js(node.properties),
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
			score,
		};
	});

	cache.set(cache_key, [setTimeout(() => cache.delete(cache_key), CACHE_TTL), data]);

	return json({ data });
};

function labels(types: string[]): string {
	const labels: string[] = [];

	const map: Record<string, string> = {
		course: "Course",
		instructor: "Instructor",
		program: "Program",
		provider: "Provider",
	};

	for (const type of types) {
		const label = map[type.toLowerCase()];
		if (label) {
			labels.push(label);
		}
	}

	return labels.join("|");
}

function sorting(order: string): [string, string] {
	const map: Record<string, [string, string]> = {
		relevance: ["score", `0`],
		name: ["node.name", `null`],
		type: ["node.type", `null`],
	};

	return map[order.toLowerCase()] || map["relevance"];
}
