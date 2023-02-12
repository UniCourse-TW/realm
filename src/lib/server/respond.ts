import { json } from "@sveltejs/kit";

export function ok(data: unknown) {
	return json({ data });
}

export function error(message: string, status = 500) {
	return json({ error: message }, { status });
}

export function not_found() {
	return json({ error: "Not found" }, { status: 404 });
}

export function bad_request(message: string) {
	return json({ error: message }, { status: 400 });
}

export function unauthorized(message: string) {
	return json({ error: message }, { status: 401 });
}

export function forbidden(message: string) {
	return json({ error: message }, { status: 403 });
}
