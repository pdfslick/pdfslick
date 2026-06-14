import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 5174
	},
	build: {
		// esbuild 0.28.1 (pinned via root overrides for security fixes) erroneously
		// tries to lower destructuring for the default `safari14` target and fails.
		// Targeting esnext avoids that lowering. See root package.json overrides.
		target: 'esnext'
	}
});
