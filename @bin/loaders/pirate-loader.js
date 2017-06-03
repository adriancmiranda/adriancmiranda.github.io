const path = require('path');
const loaderUtils = require('loader-utils');
const is = require('is');

module.exports = function(content) {
	'use strict';

	this.cacheable && this.cacheable();

	const output = '';
	const query = loaderUtils.getOptions(this) || Object.create(null);
	const options = Object.assign({}, this.options.pirate, this.pirate, query);
	const rawRequest = getRawRequest(this, options.excludedPreLoaders);
  const filePath = this.resourcePath;
  const fileName = path.basename(filePath);
	const parts = parse(content, fileName, this.sourceMap);

	return output;
};
