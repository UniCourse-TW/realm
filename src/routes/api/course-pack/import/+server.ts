/**
 * This endpoint is used to import course pack.
 * Since the course pack can be very large, we use SSE to send the progress
 * of the import.
 */
import { Role } from "$lib/constants";
import { db, ready } from "$lib/server/db";
import { merge } from "$lib/server/db-utils";
import sse, { SSECore } from "$lib/server/event";
import { en } from "$lib/strings";
import { verify } from "course-pack";
import type { CoursePack, PackedEntity } from "course-pack";
import { fromZodError } from "zod-validation-error";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.crystal?.roles.includes(Role.CoursePacker)) {
		return json({ error: en.auth.permission_denied }, { status: 403 });
	}

	await ready;

	const payload = await request.json();
	let pack: CoursePack;

	try {
		pack = verify(payload);
	} catch (error) {
		return json({ error: fromZodError(error as any).message }, { status: 400 });
	}

	const id = `task-${Math.random().toString(36).slice(2)}`;
	const evt = sse.get<{ progress: number }>(id);

	import_pack(pack, evt);

	return json({ data: { event: id } });
};

async function import_pack(pack: CoursePack, evt: SSECore<{ progress: number }>) {
	const p = (n: number) => evt.send({ type: "progress", progress: n });
	p(0);

	try {
		const instructors = await merge(
			"name",
			["Instructor"],
			pack.teachers.map(({ name }) => ({ name })),
		);
		const instructor_map = new Map(pack.teachers.map((t, i) => [t.id, instructors[i][0]]));
		p(5);

		const programs = await merge(
			"name",
			["Program"],
			pack.programs.map(({ name }) => ({ name })),
		);
		const program_map = new Map(pack.programs.map(({ id }, i) => [id, programs[i][0]]));
		p(10);

		const provider_map = new Map<string, string>();
		const course_map = new Map<string, string>();
		const dummy: PackedEntity = { name: "Root", children: pack.entities, courses: [] };

		const node_count = count_node(dummy);
		let done = 0;
		const queue = [dummy];
		while (queue.length > 0) {
			const node = queue.shift();
			if (!node) {
				break;
			}
			const parent_id = provider_map.get(node.name);
			let children: [name: string, id: string][];
			if (node === dummy) {
				const result = await db.run(
					`
				UNWIND $props AS props
				MATCH (parent:Provider {name: "Root"})
				MERGE (parent)<-[:UNDER]-(child:Provider {name: props.name})
				SET child.slug = coalesce(child.slug, props.slug)
				RETURN elementId(child) AS id
				`,
					{
						props: node.children.map((child) => ({
							name: child.name,
							slug: slugify(child.name),
						})),
					},
				);
				children = result.records.map((r, i) => [
					node.children[i].name,
					r.get("id") as string,
				]);
			} else {
				const result = await db.run(
					`
				MATCH (parent:Provider)
				WHERE elementId(parent) = $parent
				UNWIND $props AS props
				MERGE (parent)<-[:UNDER]-(child:Provider {name: props.name})
				SET child.slug = coalesce(child.slug, props.slug)
				RETURN elementId(child) AS id
				`,
					{
						parent: parent_id,
						props: node.children.map((child) => ({
							name: child.name,
							slug: slugify(child.name),
						})),
					},
				);

				children = result.records.map((r, i) => [
					node.children[i].name,
					r.get("id") as string,
				]);
			}
			for (const child of children) {
				provider_map.set(child[0], child[1]);
			}

			if (parent_id) {
				const siblings = new Set<string>();
				const courses = node.courses
					.filter((course) => {
						if (siblings.has(course.name)) {
							return false;
						}
						siblings.add(course.name);
						return !course_map.has(course.code);
					})
					.map((course) => ({
						...course,
						teachers: course.teachers
							.map((id) => instructor_map.get(id))
							.filter((t) => t),
						programs: course.programs.map((id) => program_map.get(id)).filter((p) => p),
						prerequisites: course.prerequisites
							.map((id) => course_map.get(id))
							.filter((p) => p),
						year: BigInt(course.year),
						term: BigInt(course.term),
						extra: undefined,
						id: undefined,
						slug: slugify(course.name),
					}));
				const new_courses = await db
					.run(
						`
				MATCH (parent:Provider)
				WHERE elementId(parent) = $parent
				UNWIND $props AS props
				MERGE (parent)<-[:PROVIDED_BY]-(child:Course {code: props.code})
				SET child.slug = coalesce(child.slug, props.slug),
					child.name = coalesce(props.name, child.name),
					child.description = coalesce(props.description, child.description),
					child.credits = coalesce(props.credits, child.credits),
					child.type = coalesce(props.type, child.type)
	
				WITH *
				UNWIND props.teachers AS instructor
				MATCH (i:Instructor)
				WHERE elementId(i) = instructor
				MERGE (child)-[:INSTRUCTED_BY {year: props.year, term: props.term}]->(i)
	
				WITH *
				UNWIND props.programs AS program
				MATCH (p:Program)
				WHERE elementId(p) = program
				MERGE (child)-[:PART_OF {year: props.year, term: props.term}]->(p)
	
				WITH *
				UNWIND props.prerequisites AS prerequisite
				MATCH (p:Course)
				WHERE elementId(p) = prerequisite
				MERGE (child)<-[:PREREQUISITE_OF {year: props.year, term: props.term}]-(p)
				RETURN elementId(child) AS id
				`,
						{
							parent: parent_id,
							props: courses,
						},
					)
					.then((result) =>
						result.records.map((r, i) => ({
							code: courses[i].code,
							id: r.get("id") as string,
						})),
					);

				for (const course of new_courses) {
					course_map.set(course.code, course.id);
				}
			}

			queue.push(...node.children);
			done++;
			p(10 + Math.floor((done / node_count) * (100 - 10)));
		}

		p(100);
		evt.clients.forEach((client) => client.close());
	} catch (err) {
		console.error(err);
	}
}

function slugify(text: string) {
	const real = text.replace(/[\s/\\]+/g, "-").toLowerCase();
	const rand =
		Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
	return real.endsWith("-") ? real + rand : `${real}-${rand}`;
}

function count_node(node: PackedEntity): number {
	let count = 1;
	for (const child of node.children) {
		count += count_node(child);
	}
	return count;
}
