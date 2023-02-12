import { writable } from "svelte/store";

export const bg = writable("");
export const expanded = writable(false);

export const notifications = writable<
	{ id: string; content: string; type: "info" | "error" | "success" | "" }[]
>([]);
