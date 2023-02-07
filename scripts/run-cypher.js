import { config } from "dotenv";
import neo4j from "neo4j-driver";
import { DB } from "neo4j-ogm";

config();

const NEO4J_URI = process.env.NEO4J_URI || "neo4j://db:7687";
const NEO4J_USER = process.env.NEO4J_USER || "neo4j";
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || "password";

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

const db = new DB(driver);

db.run(process.argv.join(" ")).then((res) => {
	res.records.forEach((record) => {
		console.log(record.toObject());
	});

	console.log("profile", res.summary.profile);

	driver.close();
});
