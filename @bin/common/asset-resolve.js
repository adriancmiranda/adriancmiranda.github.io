module.exports = (type, $, options = {}) => {
	options.useRelativePath = true;
	options.name = '[name].[ext]?[hash:7]';
	return options;
};
