import { env } from "$env/dynamic/private";

export const NEO4J_URI = env.NEO4J_URI || "neo4j://db:7687";
export const NEO4J_USER = env.NEO4J_USER || "neo4j";
export const NEO4J_PASSWORD = env.NEO4J_PASSWORD || "password";
export const JWT_SECRET = env.JWT_SECRET || "unicourse-jwt-secret";
export const FIRST_INVITATION_CODE = env.UNICOURSE_FIRST_INVITATION_CODE || "first_code";
export const CLOUDFLARE_R2_ENDPOINT = env.CLOUDFLARE_R2_ENDPOINT;
export const CLOUDFLARE_ACCESS_KEY_ID = env.CLOUDFLARE_ACCESS_KEY_ID;
export const CLOUDFLARE_SECRET_ACCESS_KEY = env.CLOUDFLARE_SECRET_ACCESS_KEY;
export const CLOUDFLARE_R2_BUCKET = env.CLOUDFLARE_R2_BUCKET;
export const HERMES_TOKEN = env.HERMES_TOKEN;
export const HERMES_ENDPOINT = env.HERMES_ENDPOINT;
export const EMAIL_SENDER = env.EMAIL_SENDER || "noreply@unicourse.tw";
export const EMAIL_SENDER_NAME = env.EMAIL_SENDER_NAME || "UniCourse";
