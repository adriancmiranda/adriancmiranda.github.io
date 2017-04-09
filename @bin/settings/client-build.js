/* eslint-disable global-require */
const { parse } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const pirateFlag = require('pirate-flag');
const clientBase = require('../templates/client-base');

module.exports = $ => clientBase($).cfg({
	name: '[client:build]',
	bail: true,
	devtool: $('build.sourceMap') ? '#source-map' : false,
	output: {
		publicPath: $('build.assetsPublicPath'),
		filename: $('path.output.script', '[name].[chunkhash].js'),
		chunkFilename: $('path.output.script', '[id].[chunkhash].js'),
		sourceMapFilename: $('path.output.script', '[name].[chunkhash].map'),
	},
	module: {
		rules: [],
	},
	plugins: [
		new CleanWebpackPlugin([$('path.output.bundle')], {
			root: $('cwd'),
			verbose: true,
		}),
		new webpack.DefinePlugin({
			'process.type': '"renderer"',
			'process.env': $('build.env'),
			'git.version': `"${$('git.version')}"`,
			'git.hash': `"${$('git.commithash')}"`,
		}),
		new webpack.optimize.UglifyJsPlugin(Object.assign({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		}, $('script.uglify'), {
			sourceMap: $('build.sourceMap'),
		})),
		new OptimizeCSSPlugin(Object.assign({
			cssProcessorOptions: {
				safe: true,
			},
		}, $('style.optimize'))),
		new HtmlWebpackPlugin(Object.assign({}, $('view.data'), {
			env: JSON.parse($('build.env.NODE_ENV')),
			title: `${$('package.author')} // ${$('package.description')}`,
			template: `!!pug-loader!${$('path.entry.view', $('view.entry'))}`,
			filename: $('path.output.view', `${parse($('view.entry')).name}.html`),
			chunksSortMode: 'dependency',
		})),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: module => (module.resource && /\.js$/.test(module.resource) && (
				module.resource.indexOf($('cwd', 'node_modules')) === 0 ||
				module.resource.indexOf($('cwd', $('bowerrc.directory'))) === 0
			)),
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor'],
		}),
		new webpack.BannerPlugin({
			banner: pirateFlag($('package'), {
				moment: $('now'),
				commit: $('git.commithash'),
				homepage: $('package.homepage'),
				author: $('package.author'),
			}),
		}),
		new CopyWebpackPlugin([{
			from: { glob: '**/*', dot: true },
			to: $('cwd', $('path.output.bundle'), $('path.output.static')),
			context: $('path.entry.static'),
		}]),
	],
})

// --------------------------------------------------------------------------
// *optional: https://www.npmjs.com/package/compression-webpack-plugin
// --------------------------------------------------------------------------
.cfg('plugins', $('build.gzip.compress') ? [(() => {
	const CompressionWebpackPlugin = require('compression-webpack-plugin');
	return new CompressionWebpackPlugin({
		algorithm: 'gzip',
		threshold: 10240,
		minRatio: 0.8,
	}, $('build.gzip.options'), {
		test: new RegExp(`\\.(${$('build.gzip.extensions').join('|')})$`),
		asset: '[path].gz[query]',
	});
})()] : [])

// --------------------------------------------------------------------------
// *optional: https://www.npmjs.com/package/webpack-bundle-analyzer
// --------------------------------------------------------------------------
.cfg('plugins', $('build.bundleAnalyzer.report') ? [(() => {
	const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
	return new BundleAnalyzerPlugin(Object.assign({}, $('build.bundleAnalyzer.options')));
})()] : [])
;
