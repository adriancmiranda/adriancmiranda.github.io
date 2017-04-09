module.exports.resolve = ($, assetType, options = {}) => {
	if ($(`${$('lifecycle')}.useRelativePath`)) {
		options.useRelativePath = true;
		options.outputPath = $(`path.output.${assetType}`);
		options.name = '[name].[ext]?[hash:7]';
	} else {
		options.name = '/' + $(`path.output.${assetType}`, '[name].[hash:7].[ext]');
	}
	return options;
};
