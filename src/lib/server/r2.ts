import { CreateBucketCommand, ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import {
	CLOUDFLARE_ACCESS_KEY_ID,
	CLOUDFLARE_R2_ENDPOINT,
	CLOUDFLARE_SECRET_ACCESS_KEY,
	CLOUDFLARE_R2_BUCKET,
} from "./config";

export const ready = (async () => {
	const client = get_client();
	const buckets = (await client.send(new ListBucketsCommand({}))).Buckets;
	if (buckets === undefined) {
		throw new Error("failed to list r2 buckets");
	}
	if (buckets.find((b) => b.Name === CLOUDFLARE_R2_BUCKET) == undefined) {
		await client.send(
			new CreateBucketCommand({
				Bucket: CLOUDFLARE_R2_BUCKET,
			}),
		);
	}
})();

export function get_client() {
	if (
		CLOUDFLARE_R2_ENDPOINT === undefined ||
		CLOUDFLARE_ACCESS_KEY_ID === undefined ||
		CLOUDFLARE_SECRET_ACCESS_KEY === undefined
	) {
		throw new Error("r2-related config is not set");
	}

	const s3 = new S3Client({
		region: "auto",
		endpoint: CLOUDFLARE_R2_ENDPOINT,
		credentials: {
			accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
			secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
		},
	});

	return s3;
}
