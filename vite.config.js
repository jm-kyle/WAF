import { resolve } from "path";
import { defineConfig } from "vite";

const noCacheHeaders = {
	"Cache-Control": "no-store, max-age=0",
	Expires: "0",
	Pragma: "no-cache",
};

export default defineConfig({
	server: {
		headers: noCacheHeaders,
	},
	preview: {
		headers: noCacheHeaders,
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				privacy: resolve(__dirname, "privacy.html"),
				backup: resolve(__dirname, "index-backup.html"),
				original: resolve(__dirname, "index-original.html"),
			},
		},
	},
});
