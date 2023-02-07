import { db, ready } from "./db";

export function constraint(name: string, labels: string, prop: string): string {
	return `CREATE CONSTRAINT \`${name}\` IF NOT EXISTS FOR (n:\`${labels}\`) REQUIRE n.\`${prop}\` IS UNIQUE`;
}

/**
 * Create many nodes, return their ID-prop pairs
 */
export async function create<P extends Record<string, unknown>>(
	labels: string[],
	props: P[],
): Promise<[string, P][]> {
	const label = labels.map((x) => `:${x}`).join("");
	const statement = `UNWIND $props AS props CREATE (n${label}) SET n = props RETURN elementId(n) AS id`;

	await ready;
	const result = await db.run(statement, { props });

	const ids = result.records.map((record) => record.get("id") as string);

	return ids.map((id, i) => [id, props[i]]);
}

/**
 * Merge many nodes, return their ID-prop pairs
 */
export async function merge<P extends Record<string, unknown>>(
	key: string,
	labels: string[],
	props: P[],
	replace = false,
): Promise<[string, P][]> {
	const label = labels.map((x) => `:${x}`).join("");
	const statement = `UNWIND $props AS props MERGE (n${label} {${key}: props.${key}}) SET n ${
		replace ? "" : "+"
	}= props RETURN elementId(n) AS id`;

	await ready;
	const result = await db.run(statement, { props });

	const ids = result.records.map((record) => record.get("id") as string);

	return ids.map((id, i) => [id, props[i]]);
}

/**
 * Create many relationships from a list of source IDs to a list of target IDs
 * @param sources
 * @param targets
 * @param rel_labels
 * @param rel_props
 */
export async function link(
	sources: string[],
	targets: string[],
	rel_labels: string[],
	rel_props: unknown[],
): Promise<void> {
	const rel_label = rel_labels.map((x) => `:${x}`).join("");
	const statement = `
    UNWIND $sources AS source
    UNWIND $targets AS target
    UNWIND $props AS props
    MATCH (s), (t)
    WHERE elementId(s) = source AND elementId(t) = target
    CREATE (s)-[r${rel_label}]->(t)
    SET r = props`;

	await ready;
	await db.run(statement, { sources, targets, props: rel_props });
}

/**
 * Merge many relationships from a list of source IDs to a list of target IDs
 * @param sources
 * @param targets
 * @param rel_labels
 * @param rel_props
 * @param replace
 */
export async function link_merge(
	sources: string[],
	targets: string[],
	rel_labels: string[],
	rel_props: unknown[],
	replace = false,
): Promise<void> {
	const rel_label = rel_labels.map((x) => `:${x}`).join("");
	const statement = `
    UNWIND $sources AS source
    UNWIND $targets AS target
    UNWIND $props AS props
    MATCH (s), (t)
    WHERE elementId(s) = source AND elementId(t) = target
    MERGE (s)-[r${rel_label}]->(t)
    SET r ${replace ? "" : "+"}= props`;

	await ready;
	await db.run(statement, { sources, targets, props: rel_props });
}
