const { baseTemplate } = require('webpack-cfg/templates');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const skinBase = require('./skin-base');
const pirateLoader = require.resolve('../loaders/pirate-loader');

module.exports = $ => baseTemplate($).cfg({
	name: 'common:template',
	context: $('context'),
	entry: $('script.entry'),
	output: {
		path: $('cwd', $('path.output.bundle')),
	},
	resolve: {
		alias: $('alias'),
		modules: [$('cwd', 'node_modules')],
	},
	module: {
		rules: [{
			enforce: 'pre',
			loader: 'eslint-loader',
			test: /\.js$/,
			options: Object.assign({
				formatter: eslintFriendlyFormatter,
			}, $('script.eslint')),
			include: [
				$('cwd', $('path.client')),
				$('cwd', $('path.server')),
				$('cwd', $('path.test')),
			],
		}, {
			loader: 'babel-loader',
			test: /\.js$/,
			include: [
				$('cwd', $('path.client')),
				$('cwd', $('path.server')),
				$('cwd', $('path.test')),
			],
		}, {
			loader: pirateLoader,
			test: /\.pirate$/,
			options: skinBase.style($),
		}, {
			loader: 'json-loader',
			test: /\.json$/,
		}],
	},
});
