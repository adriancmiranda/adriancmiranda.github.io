const is = require('is');
const autoprefixer = require('autoprefixer');
const fileLoader = require.resolve('../loaders/file-loader');
const asset = require('./asset');

exports.parseEntry = ($, tmpl, filename) =>
	tmpl.replace('%s', $('path.entry.style', filename));
;

exports.parseEntries = ($, tmpl) => {
	const parse = exports.parseEntry.bind(exports, $, tmpl);
	const entry = $('style.entry') || [];
	if (is.string(entry)) {
		return parse(entry);
	} else if (is.object(entry)) {
		entry = Object.keys(entry).map((name) => entry[name]);
	} if (is.array(entry)) {
		return entry.map(parse).join(' ');
	}
	throw new TypeError('Invalid style.entry');
};

const cssLoader = ($, publicPath, extract, fallback, prefix = '') => {
	const action = $('lifecycle');
	const sourceMap = $(`${action}.sourceMap`);
	const minimize = $('argv.dev');
	const cssLoader = {
		loader: 'css-loader',
		options: Object.assign({}, $(`style.${prefix}css`), {
			minimize,
			sourceMap,
		}),
	};
	if (is.empty(fallback) || extract) {
		return [{
			loader: fileLoader,
			options: asset.resolve($, 'style'),
		}, {
			loader: 'extract-loader',
		}, cssLoader];
	}
	return [fallback, cssLoader];
};

exports.style = ($, fallback = 'style-loader') => {
	const action = $('lifecycle');
	const parse = exports.parseEntries;
	const env = $(`${action}.env.NODE_ENV`);
	const sourceMap = $(`${action}.sourceMap`);
	const publicPath = $(`${action}.publicPath`);
	const extract = $('argv.dev');
	return {
		scss: cssLoader($, publicPath, extract, fallback).concat({
			loader: 'sass-loader',
			options: Object.assign({}, $('style.scss'), {
				sourceMap,
				data: [
					`$env: ${env || 'nil'};`,
					`@import "${parse($, '@import "~%s"')}";`
				].join(' '),
			}),
		}),
		sass: cssLoader($, publicPath, extract, fallback).concat({
			loader: 'sass-loader',
			options: Object.assign({}, $('style.sass'), {
				indentedSyntax: true,
				sourceMap,
				data: [
					`$env: ${env || 'nil'};`,
					`@import "${parse($, '@import ~%s')}";`
				].join(' '),
			}),
		}),
		stylus: cssLoader($, publicPath, extract, fallback).concat({
			loader: 'stylus-loader',
			options: Object.assign({}, $('style.stylus'), {
				sourceMap,
			}),
		}),
		styl: cssLoader($, publicPath, extract, fallback).concat({
			loader: 'stylus-loader',
			options: Object.assign({}, $('style.styl'), {
				sourceMap,
			}),
		}),
		less: cssLoader($, publicPath, extract, fallback).concat({
			loader: 'less-loader',
			options: Object.assign({}, $('style.less'), {
				sourceMap,
			}),
		}),
		css: cssLoader($, publicPath, extract, fallback),
		postcss: cssLoader($, publicPath, extract, fallback, 'post'),
	};
};

exports.rules = ($, fallback) => {
	const use = exports.style($, fallback);
	console.log('use:\n', use);
	return Object.keys(use).map((ext) => ({
		test: new RegExp(`\\.${ext}$`),
		use: use[ext],
	}));
};
