export class ImageStore {
	public images: Map<string, [ready: Promise<void>, url: string | undefined]>;

	constructor() {
		this.images = new Map();
	}

	add(url: string): void {
		if (this.images.has(url)) {
			return;
		}

		const entry: [ready: Promise<void>, url: string | undefined] = [
			Promise.resolve(),
			undefined,
		];

		entry[0] = new Promise((done, fail) => {
			fetch(url)
				.then((res) => {
					if (res.ok) {
						return res.blob();
					}

					throw new Error(
						`ImageStore request failed: ${res.status} ${res.statusText} @ ${url}`,
					);
				})
				.then((blob) => {
					const object = URL.createObjectURL(blob);
					entry[1] = object;
					console.log("image loaded", url);
					done();
				})
				.catch(fail);
		});

		this.images.set(url, entry);
	}

	remove(url: string): void {
		if (!this.images.has(url)) {
			return;
		}

		const [, image] = this.images.get(url) || [];
		if (image) {
			URL.revokeObjectURL(image);
		}

		this.images.delete(url);
	}

	async wait(url: string): Promise<string | void> {
		if (!this.images.has(url)) {
			this.add(url);
		}

		const entry = this.images.get(url) || [];
		if (entry[0]) {
			await entry[0];
		}

		if (entry[1]) {
			return entry[1];
		}

		return;
	}

	async load(urls: string[]): Promise<void> {
		urls.forEach((url) => this.add(url));
		await Promise.all(urls.map((url) => this.wait(url)));
	}
}

export const images = new ImageStore();
