const webpack = require('webpack');
const { contextEntries } = require('webpack-cfg/tools');
const commonTemplate = require('./');

module.exports = $ => commonTemplate($)
.cfg('entry', $('path.server'), contextEntries)
.cfg({
	name: 'server:template',
	target: 'node',
	devtool: 'sourcemap',
	recordsPath: $('cwd', $('path.output.bundle', 'records')),
	output: {
		libraryTarget: 'commonjs2',
	},
	node: Object.assign({
		global: true,
		Buffer: true,
		process: true,
		console: false,
		__dirname: true,
		__filename: true,
		setImmediate: true,
	}, $('node')),
	plugins: [
		new webpack.BannerPlugin({
			banner: `try { require('source-map-support').install(); } catch(err) { /* ! */ }`,
			entryOnly: false,
			raw: true,
		}),
	],
});
