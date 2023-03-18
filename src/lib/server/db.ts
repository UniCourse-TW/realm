import { building } from "$app/environment";
import neo4j from "neo4j-driver";
import { DB } from "neo4j-ogm";
import { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, FIRST_INVITATION_CODE } from "./config";
import { constraint } from "./db-utils";

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

export const db = building
	? ({
			run: () => ({ records: [new Map<string, any>()] }),
	  } as unknown as DB)
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
		`
		CREATE FULLTEXT INDEX COURSE_FTS IF NOT EXISTS
		FOR (n:Course|Instructor|Program|Provider)
		ON EACH [n.name, n.description, n.code]
		OPTIONS {
			indexConfig: {
				\`fulltext.analyzer\`: 'cjk',
				\`fulltext.eventually_consistent\`: true
			}
		}
		`,
	);
	await db.run(
		`
		CREATE FULLTEXT INDEX FORUM_FTS IF NOT EXISTS
		FOR (n:Post|PostTag)
		ON EACH [n.name, n.content, n.description]
		OPTIONS {
			indexConfig: {
				\`fulltext.analyzer\`: 'cjk',
				\`fulltext.eventually_consistent\`: true
			}
		}
		`,
	);

	await db.run(
		`
		MATCH (x:User {username: "admin"})
		MERGE (x)<-[:OWNED_BY]-(invitation:Invitation {
			code: $invitation_code
		})
		ON CREATE SET invitation.created = datetime(),
					  invitation.revoked = false
		`,
		{ invitation_code: FIRST_INVITATION_CODE },
	);

	console.timeEnd("Database Ready");
})();
