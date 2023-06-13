import { db, ready } from "$lib/server/db";
import { convert } from "neo4j-ogm";

export async function get_ratings(username: string): Promise<
	{
		created: Date;
		id: number;
		comment: string;
		slug: string;
		usefulness: number;
		sweetness: number;
		easiness: number;
	}[]
> {
	await ready;

	const { records } = await db.run(
		`
			MATCH (u:User {username: $username}), (c:Course)
			MATCH (u)<-[:RATE_BY]-(r:Rating)-[:ABOUT]->(c)
            OPTIONAL MATCH (post:Post)-[:LINK]->(r)
			RETURN r, c.slug as slug, post.content AS comment`,
		{ username },
	);
	const ratings = records.map((record) => {
		const rating = record.get("r");
		return {
			created: new Date(convert.js(rating.properties.created)),
			id: Number(convert.js(rating.identity)),
			comment: record.get("comment") as string,
			slug: record.get("slug") as string,
			usefulness: Number(convert.js(rating.properties.usefulness)),
			sweetness: Number(convert.js(rating.properties.sweetness)),
			easiness: Number(convert.js(rating.properties.easiness)),
		};
	});

	return ratings;
}
