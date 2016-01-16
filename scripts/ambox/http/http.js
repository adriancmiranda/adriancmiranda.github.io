/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var HttpTransform = scope.uri('HttpTransform');
	var HttpHeaders = scope.uri('HttpHeaders');
	var HttpRequest = scope.uri('HttpRequest');
	var JsonPadding = scope.uri('JsonPadding');
	var patterns = scope.uri('patterns');
	var iterate = scope.uri('iterate');

	// http
	// Adapter pattern to `XMLHttpRequest` with padding.
	// @support IE9+
	var http = new Proto(function http(options){
		return http.request(options);
	}).static('pendingRequests', []).static('defaults', {
		transformRequest:[HttpTransform.request],
		transformResponse:[HttpTransform.response],
		xsrfHeaderName:'X-XSRF-TOKEN',
		xsrfCookieName:'XSRF-TOKEN',
		headers:HttpHeaders.defaults,
		method:'GET'
	});

	iterate.index(['get', 'delete', 'head', 'jsonp'], function(method){
		http.static(method, function(url, options){
			return http(Proto.merge({}, options, {
				method: method,
				url: url
			}));
		});
	});

	iterate.index(['post', 'put', 'patch'], function(method){
		http.static(method, function(url, data, options){
			return http(Proto.merge({}, options, {
				method: method,
				data: data,
				url: url
			}));
		});
	});

	http.static('request', function(options){
		options = Proto.merge({}, http.defaults, options);
		var method = Type.isString(options.method)? options.method.trim() : 'GET';
		var request = new (/^jsonp$/i.test(method)? JsonPadding : HttpRequest)();
		return request.load(options).then(function(value){
			value.data = HttpTransform(options.transformResponse, value.toArray());
			return value;
		});
	});

	scope.uri('http', http);

}).call(this, Ambox);