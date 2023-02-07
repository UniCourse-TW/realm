export class SSECore<D extends { [key: string]: unknown } = { [key: string]: unknown }> {
	public clients = new Map<string, ReadableStreamDefaultController>();

	public send(data: { type: string } & D): void {
		this.clients.forEach((client) => {
			client.enqueue(`data: ${JSON.stringify(data)}\n\n`);
		});
	}

	public subscribe(id: string, stream: ReadableStreamDefaultController): void {
		this.clients.set(id, stream);
		stream.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
	}

	public unsubscribe(id: string): void {
		this.clients.delete(id);
	}
}

export class SSE {
	public events = new Map<string, SSECore>();

	public get<D extends { [key: string]: unknown } = { [key: string]: unknown }>(
		event: string,
	): SSECore<D> {
		if (!this.events.has(event)) {
			this.events.set(event, new SSECore());
		}

		return this.events.get(event) as SSECore;
	}
}

export const sse = new SSE();
export default sse;
