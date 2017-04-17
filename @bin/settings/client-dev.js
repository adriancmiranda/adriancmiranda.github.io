const { parse } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { prependEntries } = require('webpack-cfg/tools');
const clientBase = require('../templates/client-base');
const skinBase = require('../templates/skin-base');

module.exports = $ => clientBase($).cfg('entry', [
	$('pwd', 'pipeline/action'),
], prependEntries).cfg({
	name: '[client:dev]',
	devtool: '#cheap-module-eval-source-map',
	devServer: $('dev.server'),
	output: {
		publicPath: $('dev.assetsPublicPath'),
	},
	module: {
		rules: skinBase.rules($),
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': $('dev.env'),
			'process.type': '"renderer"',
		}),
		new HtmlWebpackPlugin(Object.assign({}, $('view.data'), {
			env: JSON.parse($('dev.env.NODE_ENV')),
			title: `${$('package.author')} // ${$('package.description')}`,
			template: `!!pug-loader!${$('path.entry.view', $('view.entry'))}`,
			filename: $('path.output.view', `${parse($('view.entry')).name}.html`),
			minify: false,
		})),
		new webpack.HotModuleReplacementPlugin({ quiet: true }),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.NamedModulesPlugin(),
		new FriendlyErrorsPlugin(),
	],
});