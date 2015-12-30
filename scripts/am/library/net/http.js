define([
	'../utils/Class',
	'../utils/Promise'
], function(Class, Promise){

	var $http = new Class(function $http(url, options, headers){
		return new HttpRequest(url, options, headers);
	});

	$http.static('delete', function(url, headers){
		return new HttpRequest(url, { method:'DELETE' }, { headers:headers });
	});

	$http.static('post', function(url, data, headers){
		return new HttpRequest(url, { method:'POST', data:data }, { headers:headers });
	});

	$http.static('put', function(url, data, headers){
		return new HttpRequest(url, { method:'PUT', data:data }, { headers:headers });
	});

	$http.static('get', function(url, headers){
		return new HttpRequest(url, { method:'GET' }, { headers:headers });
	});

	$http.static('jsonp', function(url, callbackId){
	});

	return $http;
});
