import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				alt: resolve(__dirname, "index-alt.html"),
			},
		},
	},
});
