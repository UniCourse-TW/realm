import sse from "$lib/server/event";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	if (!id) {
		return new Response("No id provided", { status: 400 });
	}

	const evt = sse.get(id);
	if (!evt) {
		return new Response("No event found", { status: 404 });
	}

	const rand = Math.random().toString(36).slice(2);
	const stream = new ReadableStream({
		start: (controller) => {
			evt.subscribe(rand, controller);
		},
		cancel: () => {
			evt.unsubscribe(rand);
		},
	});

	return new Response(stream, {
		headers: {
			"content-type": "text/event-stream",
			connection: "keep-alive",
			"cache-control": "no-cache",
		},
	});
};
