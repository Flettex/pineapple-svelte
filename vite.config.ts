import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const config: UserConfig = {
	plugins: [sveltekit()],
	// optimizeDeps: {
		// disabled: true,
	// },
	server: {
		proxy: {
			'/api': {
				target: process.env.NODE_ENV === 'production' ? 'https://flettex-backend.fly.dev/' : 'http://localhost:8080/',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			},
			'/ws': {
				target: process.env.NODE_ENV === 'production' ? 'wss://flettex-backend.fly.dev/' : 'ws://localhost:8080/',
				changeOrigin: true,
				ws: true,
			}
		}
	}
};

export default config;
