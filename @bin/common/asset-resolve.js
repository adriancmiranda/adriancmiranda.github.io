module.exports = (type, $, options = {}) => {
	if ($(`${$('lifecycle')}.useRelativePath`)) {
		options.useRelativePath = true;
		options.outputPath = $(`path.output.${type}`);
		options.name = '[name].[ext]?[hash:7]';
	} else {
		options.name = '/' + $(`path.output.${type}`, '[name].[hash:7].[ext]');
	}
	return options;
};
