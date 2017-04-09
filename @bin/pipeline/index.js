const is = require('is');
const path = require('path');
const { Router, static } = require('express');
const httpProxy = require('http-proxy-middleware');
const reporter = require('./reporter');
const node = require('./node');
const web = require('./web');

/*!
|* Express middleware for universal application development with webpack.
|* Based on `webpack-universal-middleware`
|* @see https://expressjs.com/en/guide/writing-middleware.html
|* @see https://expressjs.com/en/guide/using-middleware.html
|* @see http://expressjs.com/pt-br/api.html#router
 `*/
module.exports = (multiCompiler, options = {}) => {
	if (!is.array(multiCompiler.compilers)) {
		multiCompiler = { compilers: [multiCompiler] };
	}
	if (!options.reporter) {
		options.reporter = reporter(options);
	}
	if (is.primitive(options.proxyTable)) {
		options.proxyTable = {};
	}
	if (!options.static) {
		options.static = ['./static'];
	} else if (!is.array(options.static)) {
		options.static = [options.static];
	}

	const app = Router();

	options.static = options.static.filter((item) => {
		let realPath;
		let virtualPath;
		if (item === Object(item) && is.string(item.virtualPath) && is.string(item.realPath)) {
			realPath = path.resolve(item.realPath);
			virtualPath = item.virtualPath;
			app.use(virtualPath, static(realPath));
		} else if (is.string(item)) {
			realPath = path.resolve(item);
			app.use(static(realPath));
		}
		return (virtualPath || realPath) && { virtualPath, realPath };
	});

	Object.keys(options.proxyTable).forEach((context) => {
		let target = options.proxyTable[context];
		if (is.string(target)) {
			target = { target };
		}
		if (target.virtualPath) {
			const virtualPath = target.virtualPath;
			delete target.virtualPath;
			app.use(virtualPath, httpProxy(target.filter || context, target));
		} else {
			app.use(httpProxy(target.filter || context, target));
		}
	});

	multiCompiler.compilers.forEach((compiler) => {
		switch (compiler.options.target) {
			case 'web': app.use(web(compiler, options)); break;
			case 'node': app.use(node(compiler, options)); break;
			default: throw new Error(`Unsupported compiler target "${
				compiler.options.target
			}" in config.`);
		}
	});

	return app;
};
