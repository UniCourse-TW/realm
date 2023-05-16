import { CLOUDFLARE_R2_BUCKET } from "$lib/server/config";
import { get_client } from "$lib/server/r2";
import { z } from "zod";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	// id might contain "/"
	const id = z.string().min(1).parse(params.id);

	const client = get_client();
	const avatar = await client.send(
		new GetObjectCommand({
			Key: id,
			Bucket: CLOUDFLARE_R2_BUCKET,
		}),
	);

	const rawBody = avatar.Body;
	if (rawBody === undefined) {
		throw new Error("failed to get image from r2");
	}

	const content_type = avatar.ContentType;
	const content_length = avatar.ContentLength;

	if (content_type !== undefined) setHeaders({ "Content-Type": content_type });
	if (content_length !== undefined) setHeaders({ "Content-Length": content_length.toString() });
	return new Response(rawBody.transformToWebStream());
};
