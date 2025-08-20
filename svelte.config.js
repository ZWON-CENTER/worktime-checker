import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: dev ? '' : '/worktime-checker'
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// 에러를 무시하고 계속 진행
				console.warn(`Prerender error at ${path}: ${message}`);
			}
		}
	}
};

export default config;
