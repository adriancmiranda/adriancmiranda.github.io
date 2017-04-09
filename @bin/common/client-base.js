const { contextEntries, prependEntries } = require('webpack-cfg/tools');
const webpack = require('webpack');
const commonBase = require('./');
const assetResolve = require('./asset-resolve');

module.exports = $ => commonBase($)
.cfg('entry', $('path.client', $('path.entry.scripts')), contextEntries)
.cfg('resolve.modules', [
	$('cwd', $('path.client')),
	$('cwd', $('bowerrc.directory')),
], prependEntries)
.cfg({
	name: 'client:template',
	target: 'web',
	resolve: {
		descriptionFiles: ['bower.json'],
		extensions: ['.sass', '.scss', '.pug'],
	},
	module: {
		rules: [{
			loader: 'url-loader',
			test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
			query: assetResolve('font', $, {
				mimetype: 'application/font-woff',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.fonts')),
				$('cwd', $('bowerrc.directory')),
				$('cwd', 'node_modules'),
			],
		}, {
			loader: 'url-loader',
			test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
			query: assetResolve('font', $, {
				mimetype: 'application/font-woff2',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.fonts')),
				$('cwd', $('bowerrc.directory')),
				$('cwd', 'node_modules'),
			],
		}, {
			loader: 'url-loader',
			test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
			query: assetResolve('font', $, {
				mimetype: 'application/x-font-opentype',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.fonts')),
				$('cwd', $('bowerrc.directory')),
				$('cwd', 'node_modules'),
			],
		}, {
			loader: 'url-loader',
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			query: assetResolve('font', $, {
				mimetype: 'application/x-font-truetype',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.fonts')),
				$('cwd', $('bowerrc.directory')),
				$('cwd', 'node_modules'),
			],
		}, {
			loader: 'url-loader',
			test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			query: assetResolve('font', $, {
				mimetype: 'application/vnd.ms-fontobject',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.fonts')),
				$('cwd', $('bowerrc.directory')),
				$('cwd', 'node_modules'),
			],
		}, {
			loader: 'url-loader',
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			query: assetResolve('font', $, {
				mimetype: 'image/svg+xml',
				limit: 7000,
			}),
			include: [
				$('cwd', $('path.client'), $('path.entry.fonts')),
				$('cwd', $('bowerrc.directory')),
				$('cwd', 'node_modules'),
			],
		}, {
			loader: 'file-loader',
			test: /\.(wav|mp3|mp4|ogg|ogv)/i,
			query: assetResolve('media', $),
			include: [
				$('cwd', $('path.client'), $('path.entry.media')),
			],
		}, {
			use: [{
				loader: 'file-loader',
				query: assetResolve('media', $, {
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
			test: /\.(jpe?g|png|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
			include: [
				$('cwd', $('path.client'), $('path.entry.media')),
			],
		}],
	},
	plugins: [
		new webpack.ProvidePlugin(Object.assign({}, $('provide'))),
	],
});
