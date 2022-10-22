import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	// optimizeDeps: {
		// disabled: true,
	// },
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			},
			// '/ws': {
			// 	target: 'ws://localhost:8080',
			// 	changeOrigin: true,
			// 	ws: true,
			// }
		}
	}
};

export default config;
