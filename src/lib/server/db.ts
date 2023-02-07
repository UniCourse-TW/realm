import { building } from "$app/environment";
import neo4j from "neo4j-driver";
import { DB } from "neo4j-ogm";
import { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } from "./config";
import { constraint } from "./db-utils";

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

export const db = building
	? {
			run: () => ({ records: [new Map<string, any>()] }),
	  }
	: new DB(driver);

export const ready = (async () => {
	console.time("Database Ready");

	await db.run(
		[
			"MERGE (:User {username: 'admin'})",
			"MERGE (:Provider {name: 'Root', slug: 'root'})",
		].join(" WITH count(*) as dummy \n"),
	);

	await db.run(constraint("UNIQUE_USER_USERNAME", "User", "username"));
	await db.run(constraint("UNIQUE_USER_EMAIL", "User", "email"));
	await db.run(constraint("UNIQUE_PROVIDER_SLUG", "Provider", "slug"));
	await db.run(constraint("UNIQUE_INVITATION_CODE", "Invitation", "code"));
	await db.run(
		"CREATE FULLTEXT INDEX COURSE_FTS IF NOT EXISTS FOR (n:Course|Instructor|Program|Provider) ON EACH [n.name, n.description]",
	);
	await db.run(
		"CREATE FULLTEXT INDEX FORUM_FTS IF NOT EXISTS FOR (n:Post|Tag) ON EACH [n.name, n.content, n.description]",
	);

	console.timeEnd("Database Ready");
})();
