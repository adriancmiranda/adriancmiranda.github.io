const { Router, static } = require('express');

/*!
|* Express middleware for universal application development with webpack.
|* Based on `webpack-universal-middleware`
|* @see https://expressjs.com/en/guide/writing-middleware.html
|* @see https://expressjs.com/en/guide/using-middleware.html
|* @see http://expressjs.com/pt-br/api.html#router
 `*/
module.exports = (multiCompiler, options = {}) => {
	const app = Router();
	return app;
};
