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
		var http;
		config = Proto.merge({}, config);
		if(config.responseType === 'jsonp'){
			http = new JsonPadding();
			http = http.load(config.url);
		}else{
			http = new HttpRequest();
			http.open(config.method, config.url, config.async);
			http.setRequestHeader(config.headers);
			http.withCredentials = config.withCredentials;
			http.responseType = config.responseType;
			// http.onreadystatechange = function(response){console.log('ready:',response);};
			// http.onerror = function(reason){console.log('reason:', reason);};
			// http.onload = function(value){console.log('value:', value);};
			http.send(Type.toJson(config.data));
		}
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