/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var HttpTransform = scope.uri('HttpTransform');
	var HttpRequest = scope.uri('HttpRequest');
	var JsonPadding = scope.uri('JsonPadding');
	var patterns = scope.uri('patterns');
	var iterate = scope.uri('iterate');

	// http
	// @role Adapter pattern to `XMLHttpRequest` with padding.
	// @see http://caniuse.com/#search=XMLHttpRequest (wrong for IE9 actually)
	// @support IE9+ fallback
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var http = new Proto(function http(options){
		return http.request(options);
	}).static('defaults', {
		transformRequest:[HttpTransform.request],
		transformResponse:[HttpTransform.response],
		xsrfHeaderName:'X-XSRF-TOKEN',
		xsrfCookieName:'XSRF-TOKEN'
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
		options.method = Type.isString(options.method)? options.method.trim().toUpperCase() : '';
		options.method = patterns.isHttpMethod.test(options.method)? options.method : 'GET';
		options.xhr = Type.isFunction(options.xhr)? options.xhr : window.XMLHttpRequest;
		options.async = Type.isDefined(options.async)? Type.toBoolean(options.async) : true;
		options.timeout = Type.toUint(options.timeout);
		options.withCredentials = Type.isString(options.username) && Type.isString(options.password);
		var client = patterns.isJsonP.test(options.method)? JsonPadding : HttpRequest;
		var pending = HttpRequestStorage(http, options);
		return new client(options.xhr, options).load(options).then(pending, pending);
	});

	function HttpRequestStorage(http, options){
		http.pendingRequests = http.pendingRequests || [];
		http.pendingRequests.push(options);
		return function(value){
			var index = http.pendingRequests.indexOf(options);
			~index && http.pendingRequests.splice(index, 1);
			!http.pendingRequests.length && delete(http.pendingRequests);
			return value;
		};
	}

	scope.uri('http', http);

}).call(this, Ambox);