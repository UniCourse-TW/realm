import { CLOUDFLARE_R2_BUCKET } from "$lib/server/config";
import { db, ready } from "$lib/server/db";
import { get_profile } from "$lib/server/profile";
import { get_client } from "$lib/server/r2";
import { ok } from "$lib/server/respond";
import { en } from "$lib/strings";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}
	const profile = await get_profile(locals.crystal.username);
	return json({ data: profile });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.crystal) {
		return json({ error: en.auth.not_logged_in }, { status: 400 });
	}

	let payload;
	try {
		// parse payload
		payload = z
			.object({
				avatar: z.string(),
				intro: z.string().max(4096),
				contacts: z.array(
					z.object({
						type: z.enum(["facebook"]),
						value: z.string().url(),
					}),
				),
			})
			.parse(await request.json());
	} catch (err) {
		console.error("failed to parse payload", err);
		return json({ error: en.profile.invalid_data }, { status: 400 });
	}

	await ready;

	// validate contacts
	const invalid_contact = json({ error: en.data.invalid }, { status: 400 });
	const contacts: unknown[] = [];
	for (const c of payload.contacts) {
		switch (c.type) {
			case "facebook": {
				const url = new URL(c.value);
				if (url.hostname !== "facebook.com" && url.hostname !== "fb.me") {
					return invalid_contact;
				}
				// TODO: check user id
				// or using OAuth to verify the account
				contacts.push(c);
				break;
			}
			default:
				return invalid_contact;
		}
	}

	// upload avatar (get storage URL)
	let avatar_id;
	try {
		if (payload.avatar.length > 8 * 1024 * 1024) {
			throw new Error();
		}
		if (payload.avatar.length > 64) {
			avatar_id = await upload_avatar(
				locals.crystal.username,
				Buffer.from(payload.avatar, "base64"),
			);
		}
	} catch (error) {
		console.error(error);
		return json({ error: en.profile.upload_avatar_failed }, { status: 500 });
	}

	const command =
		`MATCH (u:User {username: $username})
	SET u.intro = $intro, u.contacts = $contacts` + (avatar_id ? ", u.avatar = $avatar" : "");

	db.run(command, {
		username: locals.crystal.username,
		intro: payload.intro,
		avatar: avatar_id,
		contacts,
	});

	return ok("ok");
};

function avatar_key(username: string) {
	const id = createId();
	return `avatar/${username}/${id}`;
}

async function upload_avatar(username: string, body: ArrayBuffer) {
	const client = get_client();
	const key = avatar_key(username);
	const param = {
		Key: key,
		Body: new Uint8Array(body),
		Bucket: CLOUDFLARE_R2_BUCKET,
	};
	await client.send(new PutObjectCommand(param));

	return key;
}
