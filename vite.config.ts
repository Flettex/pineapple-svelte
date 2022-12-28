import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const config: UserConfig = {
	plugins: [sveltekit()],
	// optimizeDeps: {
		// disabled: true,
	// },
	host: 'localhost',
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080/',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			},
			'/ws': {
				target: 'ws://localhost:8080',
				changeOrigin: true,
				ws: true,
			}
		}
	}
};

export default config;
