const { contextEntries, prependEntries, mergeEntries } = require('webpack-cfg/tools');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const commonTemplate = require('./');
const asset = require('./asset');
const fileLoader = require.resolve('../loaders/file-loader');
const urlLoader = require.resolve('../loaders/url-loader');

module.exports = $ => commonTemplate($)
.cfg('resolve.modules', $('cwd', $('path.client')), prependEntries)
.cfg('entry', mergeEntries(
	contextEntries(
		$('path.client', $('path.entry.script')),
		$('script.entry')
	),
	contextEntries(
		$('path.client', $('path.entry.style')),
		$('style.entry')
	)
), val => val)
.cfg({
	name: 'client:template',
	target: 'web',
	resolve: {
		descriptionFiles: ['bower.json'],
		extensions: ['.sass', '.scss', '.pug'],
		modules: [$('cwd', $('bowerrc.directory'))],
	},
	module: {
		rules: [{
			loader: 'imports-loader?this=>window!exports-loader?window.Modernizr',
			test: /modernizr/,
		}, {
			loader: urlLoader,
			test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
			query: asset.resolve($, 'font', {
				mimetype: 'application/font-woff',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.font')),
				$('cwd', 'node_modules'),
				$('cwd', $('bowerrc.directory')),
			],
		}, {
			loader: urlLoader,
			test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
			query: asset.resolve($, 'font', {
				mimetype: 'application/font-woff2',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.font')),
				$('cwd', 'node_modules'),
				$('cwd', $('bowerrc.directory')),
			],
		}, {
			loader: urlLoader,
			test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
			query: asset.resolve($, 'font', {
				mimetype: 'application/x-font-opentype',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.font')),
				$('cwd', 'node_modules'),
				$('cwd', $('bowerrc.directory')),
			],
		}, {
			loader: urlLoader,
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			query: asset.resolve($, 'font', {
				mimetype: 'application/x-font-truetype',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.font')),
				$('cwd', 'node_modules'),
				$('cwd', $('bowerrc.directory')),
			],
		}, {
			loader: urlLoader,
			test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			query: asset.resolve($, 'font', {
				mimetype: 'application/vnd.ms-fontobject',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.font')),
				$('cwd', 'node_modules'),
				$('cwd', $('bowerrc.directory')),
			],
		}, {
			loader: urlLoader,
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			query: asset.resolve($, 'font', {
				mimetype: 'image/svg+xml',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.font')),
				$('cwd', 'node_modules'),
				$('cwd', $('bowerrc.directory')),
			],
		}, {
			loader: fileLoader,
			test: /\.(wav|mp3|mp4|ogg|ogv)/i,
			query: asset.resolve($, 'media'),
			include: [
				$('cwd', $('path.client'), $('path.entry.media')),
			],
		}, {
			use: [{
				loader: 'babel-loader',
			}, {
				loader: 'pug-loader',
			}],
			test: /\.(pug|jade)$/,
			include: [
				$('cwd', $('path.entry.view')),
			],
		}, {
			use: [{
				loader: fileLoader,
				query: asset.resolve($, 'media', {
					hash: 'sha512',
					digest: 'hex',
				}),
			}, {
				loader: 'image-webpack-loader',
				query: Object.assign({
					bypassOnDebug: true,
					svgo: {
						plugins: [
							{ removeEmptyAttrs: false },
							{ removeViewBox: false },
						],
					},
					gifsicle: {
						optimizationLevel: 1,
						interlaced: false,
					},
					pngquant: {
						optimizationLevel: 7,
						quality: '65-90',
						speed: 4,
					},
				}, $('image.compress')),
			}],
			test: /\.(jpe?g|png|gif|svg|cur|webp)(\?v=\d+\.\d+\.\d+)?$/,
			include: [
				$('cwd', $('path.client'), $('path.entry.media')),
			],
		}],
	},
	plugins: [
		new webpack.ProvidePlugin(Object.assign({}, $('provide'))),
		new ExtractTextPlugin({
			filename: $('path.output.style', '[name].[contenthash].css'),
			disable: !!$('argv.dev'),
			allChunks: true,
		}),
	],
});
