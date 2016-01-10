/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');
	var HttpRequest = scope.uri('HttpRequest');

	// http
	// Adapter pattern to `XMLHttpRequest` with padding.
	// @support IE10+
	var http = new Proto(function http(options){
		return this.request(options);
	});

	// with data

	http.static('post', function(url, data, config){
		return this.request(url, data, { method:'post', data:data });
	});

	http.static('put', function(url, data, config){
		return this.request(url, { method:'put', data:data });
	});

	http.static('patch', function(url, data, config){
		return this.request(url, { method:'patch', data:data });
	});

	// without data

	http.static('delete', function(url, config){
		return this.request(url, { method:'delete' });
	});

	http.static('head', function(url, config){
		return this.request(url, { method:'head' });
	});

	http.static('jsonp', function(url, config){
		return this.request(url, { method:'jsonp' });
	});

	http.static('get', function(url, config){
		return this.request(url, { method:'get' });
	});

	// generic call

	http.outrun('request', function(url, data, config){
		return new HttpRequest(url, data, config);
	});

	http.outrun('request', function(url, config){
		return new HttpRequest(url, config);
	});

	scope.uri('http', http);

}).call(this, Ambox);

// function createShortMethodsWithData(name) {
//   forEach(arguments, function(name) {
//     $http[name] = function(url, data, config) {
//       return $http(extend({}, config || {}, {
//         method: name,
//         url: url,
//         data: data
//       }));
//     };
//   });
// }