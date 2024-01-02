import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'

export default [
	{
		input: './src/App.svelte',
		output: {
			name: 'App',
			file: './build/server.js',
			format: 'es',
		},
		plugins: [
			svelte({
				compilerOptions: {
					generate: 'ssr',
					hydratable: true,
				},
				emitCss: false,
			}),
			resolve({
				browser: false
			}),
		],
	},
	{
		input: './src/app.js',
		output: {
			name: 'App',
			file: './build/client.js',
			format: 'iife',
		},
		plugins: [
			svelte({
				compilerOptions: {
					hydratable: true,
				},
				emitCss: false,
			}),
			resolve({
				// Need to set this or the interval stuff doesn't work.
				browser: true
			}),
		],
	}
]
