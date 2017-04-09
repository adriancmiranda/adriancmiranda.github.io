const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const pirateFlag = require('pirate-flag');
const serverBase = require('../templates/server-base');

module.exports = $ => serverBase($).cfg({
	name: '[server:build]',
	devtool: '#source-map',
	externals: [nodeExternals({ whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i] })],
	output: {
		publicPath: $('build.assetsPublicPath'),
		sourceMapFilename: '[name].map',
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: pirateFlag($('package'), {
				moment: $('now'),
				commit: $('git.commithash'),
				homepage: $('package.homepage'),
				author: $('package.author'),
			}),
		}),
	],
});
