const chalk = require('chalk');

const leftpad = (msg, len) => (' '.repeat(len) + msg).slice(-1 * len);

module.exports = ({
	left = '',
	msg = '',
	msgColor = 'black',
	tokenColor = 'black',
	bgColor = 'bgGreen',
	buildPercent = 0,
}) => {
	if (module.exports.enabled) {
		const percentText = `[${leftpad(buildPercent, 3)}%] `;
		const pad = ' '.repeat(process.stdout.columns - left.length - msg.length - percentText.length - 3);
		const lineEnding = left === '' ? '\r' : '\n';
		const message = `${chalk[tokenColor](left)} ${chalk[msgColor](msg)}${pad}${chalk[tokenColor](percentText)}`;
		process.stdout.write(`\r${chalk[bgColor](message)}${lineEnding}`);
	}
};

module.exports.enabled = true;
module.exports.log = (name, msg, msgColor = 'black', bgColor = 'bgGreen', tokenColor = 'black') => {
	module.exports('[HOT]', `${name} ${msg}`, msgColor, tokenColor, bgColor);
};
