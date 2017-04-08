const express = require('express');

export default (request, response, next) => {
	if (request.url === '/api') {
		response.send(`server: up & running`);
	} else {
		next();
	}
};
