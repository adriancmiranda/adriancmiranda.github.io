const { join } = require('path');
const is = require('is');
const chalk = require('chalk');
const MemoryFileSystem = require('memory-fs');
const reporter = require('./reporter');
const load = require('./load');

module.exports = (compiler, options) => {
	compiler.outputFileSystem = new MemoryFileSystem();
	options.reporter = options.reporter || reporter(options);

	const log = options.reporter.observe(compiler);
	const fs = compiler.outputFileSystem;
	const sharedContext = { log };
	const requestQueue = [];

	let server;
	function loadServer(stats) {
		const chunkName = Object.keys(stats.toJson().assetsByChunkName)[0];
		const assets = stats.toJson().assetsByChunkName[chunkName];
		const filename = is.array(assets) ? assets.find(asset => /\.js$/.test(asset)) : assets;
		try {
			global.webpackCfgMiddlewareContext = sharedContext;
			server = load(fs, join(compiler.outputPath, filename));
			delete global.webpackCfgMiddlewareContext;
			log('loaded');
		} catch (error) {
			log('load failed', 'red');
			process.stderr.write(chalk.red(`${error.message}\n${error.stack}\n`));
		}
	}

	compiler.watch({}, (error, stats) => {
		if (stats.hasErrors()) return;
		if (!server || !sharedContext.hotCheck) {
			loadServer(stats);
			while (requestQueue.length) {
				server(...requestQueue.shift());
			}
		} else {
			sharedContext.hotCheck(stats).catch(() => loadServer(stats));
		}
	});

	compiler.watch({}, (err, stats) => {
		if (stats.hasErrors()) return;
		if (!server || !sharedContext.hotCheck) {
			loadServer(stats);
			while (requestQueue.length) server(...requestQueue.shift());
		} else {
			sharedContext.hotCheck(stats).catch(() => loadServer(stats));
		}
	});

	return (request, response, next) => {
		if (is.fn(server)) {
			server(request, response, next);
			return;
		}
		requestQueue.push([request, response, next]);
	};
};
