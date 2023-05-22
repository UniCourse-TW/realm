import { HERMES_TOKEN, HERMES_ENDPOINT, EMAIL_SENDER, EMAIL_SENDER_NAME } from "$lib/server/config";

export async function send(to: string[], subject: string, body: string): Promise<void> {
	if (!HERMES_TOKEN) {
		throw new Error("HERMES_TOKEN is not set, cannot send email");
	}
	if (!HERMES_ENDPOINT) {
		throw new Error("HERMES_ENDPOINT is not set, cannot send email");
	}

	const res = await fetch(new URL("/api/send", HERMES_ENDPOINT), {
		method: "POST",
		headers: {
			Authorization: `Bearer ${HERMES_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: {
				email: EMAIL_SENDER,
				name: EMAIL_SENDER_NAME,
			},
			to,
			subject: subject,
			content: body,
		}),
	});

	if (!res.ok) {
		throw new Error(`Hermes responded with ${res.status} ${res.statusText}`);
	}
}
