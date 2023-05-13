import { config } from "dotenv";

config();

export const NEO4J_URI = process.env.NEO4J_URI || "neo4j://db:7687";
export const NEO4J_USER = process.env.NEO4J_USER || "neo4j";
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || "password";
export const JWT_SECRET = process.env.JWT_SECRET || "unicourse-jwt-secret";
export const FIRST_INVITATION_CODE = process.env.UNICOURSE_FIRST_INVITATION_CODE || "first_code";
export const CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
export const CLOUDFLARE_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID;
export const CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
export const CLOUDFLARE_R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET;
