require('eventsource-polyfill');
const hot = require('webpack-hot-middleware/client?noInfo=true&reload=true');

hot.subscribe((evt) => {
	if (evt.action === 'reload') {
		window.location.reload();
	}
});
