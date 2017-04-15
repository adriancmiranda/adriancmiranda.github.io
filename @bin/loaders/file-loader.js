/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
const path = require("path");
const loaderUtils = require("loader-utils");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  if (!this.emitFile) throw new Error("emitFile is required from module system");

  const query = loaderUtils.getOptions(this) || {};
  const configKey = query.config || "fileLoader";
  const options = this.options[configKey] || {};
  const config = Object.assign({
    regExp: undefined,
    context: undefined,
    useRelativePath: false,
    cssOutputPath: "",
    outputPath: "",
    publicPath: "",
    name: "[hash].[ext]",
  }, options, query);

  const context = config.context || this.options.context || process.cwd();
  const issuerContext = (this._module && this._module.issuer && this._module.issuer.context) || context;
  let url = loaderUtils.interpolateName(this, config.name, {
    regExp: config.regExp,
    context,
    content,
  });

  if (config.outputPath) {
    // support functions as outputPath to generate them dynamically
    config.outputPath = parsePath("outputPath", url);
  }

  if (config.useRelativePath) {
    // Only the dirname is needed in this case.
    config.outputPath = config.outputPath.replace(url, "");

    // We have access only to entry point relationships. So we work with this relations.
    let relativePath = issuerContext && path.relative(issuerContext, this.resourcePath);
    relativePath = relativePath ? path.dirname(relativePath) : config.outputPath;

    // Output path
    // If the `output.dirname` is pointing to up in relation to the `config.outputPath`.
    // We forced him to the webpack output path config. Even though it is empty.
    const output = this.options.output || {};
    output.dirname = relativePath.replace(/\.\.(\/|\\)/g, "").split(path.sep).join("/");
    if (output.dirname.indexOf(config.outputPath) !== 0) output.dirname = config.outputPath;
    config.outputPath = path.join(output.dirname, url).split(path.sep).join("/");

    // Public path
    // Entry files doesn't pass through the `file-loader`.
    // So we haven't access to the files context to compare with your assets context
    // then we need to create and the same way, force the `relativePath` to bundled files
    // on the webpack output path config folder and manually the same with CSS file.
    if (output.filename && path.extname(output.filename)) {
      relativePath = output.dirname;
    } else if (output.path && toString.call(config.cssOutputPath) === "[object String]") {
      output.bundle = output.path.replace(this.options.context + path.sep, "");
      output.issuer = path.join(context, output.bundle, config.cssOutputPath);
      output.asset = path.join(context, output.bundle, output.dirname);
      relativePath = path.relative(output.issuer, output.asset);
    }
    url = path.join(relativePath, url).split(path.sep).join("/");
  } else if (config.outputPath) {
    url = config.outputPath;
  } else {
    config.outputPath = url;
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;
  if (config.publicPath) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(parsePath("publicPath", url));
  }

  if (query.emitFile === undefined || query.emitFile) {
    this.emitFile(config.outputPath, content);
  }

  return `module.exports = ${publicPath};`;
  function parsePath(property, slug) {
    if (!config[property]) {
      return slug;
    } else if (typeof config[property] === 'function') {
      return config[property](slug);
    }
    return config[property] + slug;
  }
};

module.exports.raw = true;
