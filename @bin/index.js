const { relative } = require('path');
const fs = require('fs-extra');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { alias } = require('webpack-cfg/tools');
const webpackCfg = require('webpack-cfg');
const moment = require('moment');

moment.locale();

const git = new GitRevisionPlugin({ lightweightTags: true });
const pkg = fs.readJsonSync('package.json');
const bowerrc = fs.readJsonSync('.bowerrc');
const www = webpackCfg({
  client: 'configs/client-*.js',
  server: 'configs/server-*.js',
});

module.exports = www.setConfig((all, cli, api) => {
	// ~ metadata ~
	all.set('package', pkg);
	all.set('bowerrc', bowerrc);
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
	all.set('path.assets', 'assets');
	all.set('path.server', 'server');

	// ~ entry ~
	all.set('path.entry.static', 'static');
	all.set('path.entry.media', all.res('path.assets', 'media'));
	all.set('path.entry.fonts', all.res('path.assets', 'fonts'));
	all.set('path.entry.styles', 'styles');
	all.set('path.entry.scripts', '');
	all.set('path.entry.views', 'views');

	// ~ output ~
	all.set('path.output.bundle', 'bundle');
	all.set('path.output.static', 'static');
	all.set('path.output.media', all.res('path.client', 'media'));
	all.set('path.output.fonts', all.res('path.client', 'fonts'));
	all.set('path.output.styles', all.res('path.client', 'styles'));
	all.set('path.output.scripts', all.res('path.client', 'scripts'));
	all.set('path.output.views', 'views');

	// ~ common aliases ~
	all.set('alias.views', all.res('path.entry.views'));
	all.set('alias.data', all.res('path.client', 'data'));
	all.set('alias.assets', all.res('path.client', all.res('path.assets')));

	// ~ dev lifecycle ~
	all.set('dev.env.NODE_ENV', '"development"');
	all.set('dev.assetsPublicPath', '/');
	all.set('dev.host', 'localhost');
	all.set('dev.port', 3000);
	all.set('dev.autoOpenBrowser', true);
	all.set('dev.sourceMap', false);
	all.set('dev.proxy[/api/*]', `http://${all.get('dev.host')}:${all.get('dev.port') + 1}`);

	// ~ test lifecycle ~
	all.set('test.env.NODE_ENV', '"testing"');

	// ~ build lifecycle ~
	all.set('build.env.NODE_ENV', '"production"');
	all.set('build.assetsPublicPath', '/');
	all.set('build.sourceMap', true);
	all.set('build.gzip', false);
	all.set('build.gzipExtensions', ['js', 'css']);
	all.set('build.bundleAnalyzerReport', process.env.npm_config_report);

	// ~ server settings ~
	api.set('alias.~', all.res('path.server'));
	api.set('script.entry.server', './index.js');

	// ~ client settings ~
	cli.set('alias.~', all.res('path.client'));
	cli.set('alias.@vendors', all.res('bowerrc.directory'));
	cli.set('provide.trace', '@vendors/trace');
	cli.set('script.entry.index', './index.js');
	cli.set('style.entry', './index.scss');
	cli.set('view.entry', './index.pug');
	cli.set('view.data.minify.removeAttributeQuotes', false);
	cli.set('view.data.minify.collapseWhitespace', false);
	cli.set('view.data.minify.removeComments', false);
	cli.set('view.data.inject', false);
});
