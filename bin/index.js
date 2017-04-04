const {relative} = require('path');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const portfolio = require('webpack-cfg');
const moment = require('moment');

moment.locale();
module.exports = argv => portfolio({
  client: 'client/client-*.js',
  server: 'server/server-*.js',
}, ($, cli, srv) => {
  // ~ common ~
  $.set('now', moment());
  $.set('pwd', __dirname);
  $.set('ctx', process.cwd());
  $.set('cwd', process.cwd());
  $.set('pkg', require(relative(__dirname, 'package.json')));
  $.set('git', new GitRevisionPlugin({ lightweightTags: true }));
  $.set('report', process.env.npm_config_report);
  $.set('lifecycle', process.env.npm_lifecycle_event);
  $.set('path.🚪.bundle', 'bundle');
  $.set('path.🔌.static', 'static');
  $.set('path.🚪.static', $.res('path.🔌.assets', 'static');
  $.set('path.🔌.assets', 'assets');
  $.set('path.🚪.assets', $.res('path.🚪.static', 'assets'));
  $.set('path.🔌.client', 'client');
  $.set('path.🚪.client', $.res('path.🚪.static', 'scripts'));
  $.set('path.🔌.server', 'server');
  $.set('path.🚪.server', '');
  $.set('path.🔌.styles', 'styles');
  $.set('path.🚪.styles', $.res('path.🚪.static', 'styles');
  $.set('path.🔌.images', 'images');
  $.set('path.🚪.images', $.res('path.🚪.static', 'images');
  $.set('path.🔌.fonts', 'fonts');
  $.set('path.🚪.fonts', $.res('path.🚪.static', 'fonts');
  $.set('path.🔌.views', 'views');
  $.set('path.🚪.views', 'views');
  $.set('path.🔌.test', 'test');

  // ~ server ~
  srv.set('script.entry', $.res('path.🔌.server', 'index.js'));
  srv.set('view.entry', $.res('path.🔌.views', 'index.pug'));

  // ~ client ~
  cli.set('script.entry', $.res('path.🔌.client', 'index.js'));
  cli.set('style.entry', $.res('path.🔌.styles', '_all.scss'));
});
