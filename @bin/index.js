const {relative} = require('path');
const Git = require('git-revision-webpack-plugin');
const portfolio = require('webpack-cfg');
const moment = require('moment');

module.exports = argv => portfolio({
  client: 'client/client-*.js',
  server: 'server/server-*.js',
}, (opt, cli, srv) => {
  // ~ common ~
  moment.locale();
  opt.set('now', moment());
  opt.set('pwd', __dirname);
  opt.set('ctx', process.cwd());
  opt.set('cwd', process.cwd());
  opt.set('git', new Git({ lightweightTags: true }));
  opt.set('pkg', require(relative(__dirname, 'package.json')));
  opt.set('bower', require(relative(__dirname, 'bower.json')));
  opt.set('report', process.env.npm_config_report);
  opt.set('lifecycle', process.env.npm_lifecycle_event);
  opt.set('path.🚪.bundle', 'bundle');
  opt.set('path.🔌.static', 'static');
  opt.set('path.🚪.static', opt.res('path.🔌.assets', 'static');
  opt.set('path.🔌.assets', 'assets');
  opt.set('path.🚪.assets', opt.res('path.🚪.static', 'assets'));
  opt.set('path.🔌.public', 'public');
  opt.set('path.🚪.public', opt.res('path.🚪.static', 'scripts'));
  opt.set('path.🔌.server', 'server');
  opt.set('path.🚪.server', '');
  opt.set('path.🔌.styles', 'styles');
  opt.set('path.🚪.styles', opt.res('path.🚪.static', 'styles');
  opt.set('path.🔌.images', 'images');
  opt.set('path.🚪.images', opt.res('path.🚪.static', 'images');
  opt.set('path.🔌.fonts', 'fonts');
  opt.set('path.🚪.fonts', opt.res('path.🚪.static', 'fonts');
  opt.set('path.🔌.views', 'views');
  opt.set('path.🚪.views', 'views');
  opt.set('path.🔌.test', '@test');

  // ~ server ~
  srv.set('script.entry', opt.res('path.🔌.server', 'index.js'));
  srv.set('view.entry', opt.res('path.🔌.views', 'index.pug'));
  srv.set('view.minify.removeAttributeQuotes', false);
  srv.set('view.minify.collapseWhitespace', false);
  srv.set('view.minify.removeComments', false);
  srv.set('view.option.inject', false);

  // ~ client ~
	cli.set('alias.@vendors', opt.res('bower.directory'));
	cli.set('provide.Modernizr', '@vendors/modernizr/modernizr');
	cli.set('provide.trace', '@vendors/trace');
  cli.set('script.entry', opt.res('path.🔌.public', 'index.js'));
  cli.set('script.uglify.minimize', false);
  cli.set('style.entry', opt.res('path.🔌.styles', '_all.scss'));
  cli.set('style.css.minimize', true);
  cli.set('images.compress.pngquant.quality', '65-90');
  cli.set('images.compress.pngquant.speed', 4);
  cli.set('images.compress.pngquant.optimizationLevel', 7);
  cli.set('images.compress.gifsicle.optimizationLevel', 1);
  cli.set('images.compress.gifsicle.interlaced', false);
  cli.set('images.compress.svgo.plugins', [{ removeViewBox: false }]);
  cli.set('images.compress.svgo.plugins', [{ removeEmptyAttrs: false }]);
});
