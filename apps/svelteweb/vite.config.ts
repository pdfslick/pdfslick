import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 5174,
		fs: {
			// The linked core package loads its emitted PDF.js worker at runtime.
			allow: [fileURLToPath(new URL('../../packages/core/dist', import.meta.url))]
		}
	}
});
