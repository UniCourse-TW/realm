import ReconnectingEventSource from "reconnecting-eventsource";

export class Event<D extends { [key: string]: unknown } = { [key: string]: unknown }> {
	public source: ReconnectingEventSource;

	constructor(url: string) {
		this.source = new ReconnectingEventSource(url);
	}

	public listen(callback: (data: { type: string } & D) => void) {
		this.source.addEventListener("message", (evt) => {
			callback(JSON.parse(evt.data));
		});
	}

	static get<D extends { [key: string]: unknown } = { [key: string]: unknown }>(
		name: string,
	): Event<D> {
		return new Event(`/api/event/${name}`);
	}
}
