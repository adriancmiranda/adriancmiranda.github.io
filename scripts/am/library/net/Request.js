define([
	'./HttpRequest',
	'../utils/Promise'
], function(HttpRequest, Promise){
	
	var Request = new Class(function Request(){
		this.super.constructor.call(this);
	}).extends(HttpRequest);

	Request.method('delete', function(url, headers){
		return this.request('DELETE', url, headers);
	});

	Request.method('post', function(url, data, headers){
		return this.request('POST', url, data, headers);
	});

	Request.method('put', function(url, data, headers){
		return this.request('PUT', url, data, headers);
	});

	Request.method('get', function(url, headers){
		return this.request('GET', url, headers);
	});

	return Request;
});