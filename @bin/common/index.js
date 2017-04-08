const { baseTemplate } = require('webpack-cfg/templates');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

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
				$('cwd', $('path.source')),
				$('cwd', $('path.test')),
			],
		}, {
			loader: 'babel-loader',
			test: /\.js$/,
			include: [
				$('cwd', $('path.source')),
				$('cwd', $('path.test')),
			],
		}, {
			loader: 'json-loader',
			test: /\.json$/,
		}],
	},
});
