const nodeExternals = require('webpack-node-externals');
const serverBase = require('../common/server-base');

module.exports = $ => serverBase($).cfg({
	name: 'server:build',
	devtool: '#source-map',
	externals: [nodeExternals()],
	output: {
		publicPath: $('build.host'),
	},
});
