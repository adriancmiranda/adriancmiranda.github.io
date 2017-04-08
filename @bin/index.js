const {relative} = require('path');
const Git = require('git-revision-webpack-plugin');
const portfolio = require('webpack-cfg');
const moment = require('moment');

module.exports = argv => portfolio({
  client: 'configs/client-*.js',
  server: 'configs/server-*.js',
}, (all, cli, api) => {
  // ~ common ~
  moment.locale();
  all.set('now', moment());
  all.set('pwd', __dirname);
  all.set('ctx', process.cwd());
  all.set('cwd', process.cwd());
  all.set('git', new Git({ lightweightTags: true }));
  all.set('pkg', require(relative(__dirname, 'package.json')));
  all.set('bower', require(relative(__dirname, 'bower.json')));
  all.set('report', process.env.npm_config_report);
  all.set('lifecycle', process.env.npm_lifecycle_event);
  all.set('path.🚪.bundle', 'bundle');
  all.set('path.🔌.static', 'static');
  all.set('path.🚪.static', all.res('path.🔌.assets', 'static');
  all.set('path.🔌.assets', 'assets');
  all.set('path.🚪.assets', all.res('path.🚪.static', 'assets'));
  all.set('path.🔌.public', 'public');
  all.set('path.🚪.public', all.res('path.🚪.static', 'scripts'));
  all.set('path.🔌.server', 'server');
  all.set('path.🚪.server', '');
  all.set('path.🔌.styles', 'styles');
  all.set('path.🚪.styles', all.res('path.🚪.static', 'styles');
  all.set('path.🔌.images', 'images');
  all.set('path.🚪.images', all.res('path.🚪.static', 'images');
  all.set('path.🔌.fonts', 'fonts');
  all.set('path.🚪.fonts', all.res('path.🚪.static', 'fonts');
  all.set('path.🔌.views', 'views');
  all.set('path.🚪.views', 'views');
  all.set('path.🔌.test', '@test');

  // ~ server ~
  api.set('script.entry', all.res('path.🔌.server', 'index.js'));
  api.set('view.entry', all.res('path.🔌.views', 'index.pug'));
  api.set('view.minify.removeAttributeQuotes', false);
  api.set('view.minify.collapseWhitespace', false);
  api.set('view.minify.removeComments', false);
  api.set('view.option.inject', false);

  // ~ client ~
	cli.set('alias.@vendors', all.res('bower.directory'));
	cli.set('provide.Modernizr', '@vendors/modernizr/modernizr');
	cli.set('provide.trace', '@vendors/trace');
  cli.set('script.entry', all.res('path.🔌.public', 'index.js'));
  cli.set('script.uglify.minimize', false);
  cli.set('style.entry', all.res('path.🔌.styles', '_all.scss'));
  cli.set('style.css.minimize', true);
  cli.set('images.compress.pngquant.quality', '65-90');
  cli.set('images.compress.pngquant.speed', 4);
  cli.set('images.compress.pngquant.optimizationLevel', 7);
  cli.set('images.compress.gifsicle.optimizationLevel', 1);
  cli.set('images.compress.gifsicle.interlaced', false);
  cli.set('images.compress.svgo.plugins', [{ removeViewBox: false }]);
  cli.set('images.compress.svgo.plugins', [{ removeEmptyAttrs: false }]);
});
