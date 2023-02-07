import fs from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig(() => ({
	entry: ["build/index.js"],
	outDir: "dist",
	target: "node16",
	format: ["esm"],
	clean: true,
	splitting: false,
	shims: true,
	outExtension() {
		return { js: ".mjs" };
	},
	async onSuccess() {
		let content = fs.readFileSync("dist/index.mjs", "utf8");
		content = content.replace(/"524288"/g, `"134217728"`);
		fs.writeFileSync("dist/index.mjs", content);
		return () => {
			console.log("Done!");
		};
	},
}));
