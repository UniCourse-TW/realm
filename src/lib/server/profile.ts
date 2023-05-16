import { convert } from "neo4j-ogm";
import { db, ready } from "./db";

export type Profile = {
	username: string;
	roles: string[];
	email: string;
	avatar: string | undefined;
	intro: string;
	schools: string[];
	contacts: {
		type: string;
		value: string;
	}[];
};

export async function get_profile(username: string): Promise<Profile> {
	await ready;
	const { records } = await db.run(
		`
		MATCH (user:User { username: $username })
		OPTIONAL MATCH (user)-[:MEMBER_OF]->(school:Provider)
		RETURN user, collect(school.name) AS schools`,
		{ username },
	);

	const user = convert.js(records[0].get("user").properties);
	const roles = records[0].get("user").labels;
	const schools = (records[0].get("schools") as string[]) || [];

	return {
		username: user.username,
		roles,
		email: user.email,
		avatar: user.avatar,
		intro: user.intro || "",
		schools,
		contacts: user.contacts || [],
	};
}
