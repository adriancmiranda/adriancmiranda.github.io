define([
	'../utils/Class',
	'../utils/Promise'
], function(Class, Promise){

	var HttpRequest = new Class(function HttpRequest(url, options, headers){
		var xhr = new XHR();
		var jsonp = new JSONP();
	});

	return HttpRequest;
});
