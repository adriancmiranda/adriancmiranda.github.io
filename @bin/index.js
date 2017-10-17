const { relative } = require('path');
const fs = require('fs-extra');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { alias } = require('webpack-cfg/tools');
const webpackCfg = require('webpack-cfg');
const moment = require('moment');

moment.locale();

const git = new GitRevisionPlugin({ lightweightTags: true });
const pkg = fs.readJsonSync('package.json', { throws: false });
const bowerrc = fs.readJsonSync('.bowerrc', { throws: false });
const babelrc = fs.readJsonSync('.babelrc', { throws: false });
const www = webpackCfg({
	client: 'settings/client-*.js',
	server: 'settings/server-*.js',
});

module.exports = www.setConfig((all, cli, api) => {

	// --------------------------------------------------------------------------
	//
	// COMMON
	//
	// --------------------------------------------------------------------------

	// ~ metadata ~
	all.set('package', pkg);
	all.set('bowerrc', bowerrc);
	all.set('babelrc', babelrc);
	all.set('context', process.cwd());
	all.set('cwd', process.cwd());
	all.set('pwd', alias(__dirname));
	all.set('now', moment().format('LLLL'));
	all.set('git.commithash', git.commithash());
	all.set('git.version', git.version());
	all.set('lifecycle', process.env.npm_lifecycle_event);

	// ~ structure folders ~
	all.set('path.test', '@test');
	all.set('path.client', 'public');
	all.set('path.asset', 'assets');
	all.set('path.server', 'server');

	// ~ entry ~
	all.set('path.entry.static', 'static');
	all.set('path.entry.media', all.res('path.asset', 'media'));
	all.set('path.entry.font', all.res('path.asset', 'fonts'));
	all.set('path.entry.style', 'styles');
	all.set('path.entry.script', '');
	all.set('path.entry.view', 'views');

	// ~ output ~
	all.set('path.output.bundle', 'bundle');
	all.set('path.output.static', '');
	all.set('path.output.media', 'media');
	all.set('path.output.font', 'fonts');
	all.set('path.output.style', 'styles');
	all.set('path.output.script', 'scripts');
	all.set('path.output.view', '');

	// ~ common aliases ~
	all.set('alias.view', all.res('path.entry.view'));

	// ~ common providers ~
	all.set('provide.$', 'jquery');
	all.set('provide.jQuery', 'jquery');

	// ~ dev lifecycle ~
	all.set('dev.env.NODE_ENV', '"development"');
	all.set('dev.host', 'localhost');
	all.set('dev.port', 3000);
	all.set('dev.assetsPublicPath', '');
	all.set('dev.useRelativePath', true);
	all.set('dev.autoOpenBrowser', true);
	all.set('dev.sourceMap', false);
	all.set('dev.proxy[/api/*]', `http://${all.get('dev.host')}:${all.get('dev.port') + 1}`);

	// ~ test lifecycle ~
	all.set('test.env.NODE_ENV', '"testing"');

	// ~ build lifecycle ~
	all.set('build.env.NODE_ENV', '"production"');
	all.set('build.assetsPublicPath', '');
	all.set('build.useRelativePath', true);
	all.set('build.sourceMap', true);
	all.set('build.gzip', false);
	all.set('build.gzip.extensions', ['js', 'css']);
	all.set('build.bundleAnalyzer.report', process.env.npm_config_report);


	// --------------------------------------------------------------------------
	//
	// SERVER
	//
	// --------------------------------------------------------------------------

	// ~ server aliases settings ~
	api.set('alias.~', all.res('path.server'));

	// ~ server script settings ~
	api.set('script.entry.server', './index.js');


	// --------------------------------------------------------------------------
	//
	// CLIENT
	//
	// --------------------------------------------------------------------------

	// ~ client aliases settings ~
	cli.set('alias.~', all.res('path.client'));
	cli.set('alias.data', all.res('path.client', 'data'));
	cli.set('alias.asset', all.res('path.client', all.res('path.asset')));
	cli.set('alias.@vendors', all.res('bowerrc.directory') || 'bower_components');

	// ~ client providers settings ~
	cli.set('provide.Proto', 'Proto');
	cli.set('provide.Modernizr', 'Modernizr');
	cli.set('provide.trace', 'trace');

	// ~ client script settings ~
	cli.set('script.entry.index', './index.js');

	// ~ client style settings ~
	cli.set('style.entry', './index.scss');

	// ~ client view settings ~
	cli.set('view.entry', './index.pug');
	cli.set('view.data.minify.removeAttributeQuotes', false);
	cli.set('view.data.minify.collapseWhitespace', false);
	cli.set('view.data.minify.removeComments', false);
	cli.set('view.data.inject', false);
});
