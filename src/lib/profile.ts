import { base } from "$app/paths";

export function type_to_icon(ty: string) {
	const mapping = new Map([
		["facebook", "mdi:facebook"],
		["github", "mdi:github"],
	]);

	const icon = mapping.get(ty);
	return icon ?? "";
}

export function avatar_url(id: string | undefined) {
	if (!id) {
		return "https://unicornify.pictures/avatar/1627a2191cc8dcaf33ab1463e6dee360?s=128";
	}
	return `${base}/api/upload/${id}`;
}
