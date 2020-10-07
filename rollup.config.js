import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

import babel from '@rollup/plugin-babel';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer'; // 9.x.x
import tailwindcss from 'tailwindcss';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		svelte({
			// https://github.com/sveltejs/svelte-preprocess/blob/master/docs/getting-started.md
			preprocess: sveltePreprocess({
				postcss: {
					plugins: [
						atImport(),
						autoprefixer(),
						tailwindcss(),
					]
				}	
			}),
			// enable run-time checks when not in production
			dev: !production,
			// emit CSS as "files" for other plugins to process
			// emitCss: true,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		commonjs(),

		// Making a svelte app compatible with Internet Explorer 11
		// https://blog.az.sg/posts/svelte-and-ie11/
		babel({
			exclude: [ 'node_modules/@babel/**', 'node_modules/core-js/**' ],
			babelHelpers: 'runtime',
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							chrome: '38'
						},
						useBuiltIns: 'usage',
						corejs: 3
					}
				]
			],
			plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true
          }
        ]
      ]
    }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],

	watch: {
		clearScreen: false
	}
};
