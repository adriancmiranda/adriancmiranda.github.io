const nodeExternals = require('webpack-node-externals');
const serverBase = require('../common/server-base');

module.exports = $ => serverBase($).cfg({
	name: '[server:build]',
	devtool: '#source-map',
	externals: [nodeExternals({ whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] })],
	output: {
		publicPath: $('build.assetsPublicPath'),
		sourceMapFilename: '[name].map',
	},
});
