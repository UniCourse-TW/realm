import { notifications } from "./store";

export function append(content: string, type: "info" | "error" | "success" | "" = "") {
	notifications.update((n) => {
		n.push({ id: Math.random().toString().slice(2), content, type });
		return n;
	});

	setTimeout(() => {
		notifications.update((n) => {
			n.shift();
			return n;
		});
	}, 5000);
}
