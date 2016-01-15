/* global Ambox */
;(function (scope) {
	console.log(Ambox.banner);

	var JsonPadding = scope.uri('JsonPadding');
	var HttpRequest = scope.uri('HttpRequest');
	var iterate = scope.uri('iterate');
	var Ticker = scope.uri('Ticker');
	var Proto = scope.uri('Proto');
	var Timer = scope.uri('Timer');
	var Type = scope.uri('Type');
	var URL = scope.uri('URL');

	var url = 'https://api.parse.com/1/classes/Message';
	var http = new HttpRequest();
	http.open('post', url, true);
	// http.setRequestHeader(headers);
	http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	http.setRequestHeader('X-Parse-Application-Id', 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq');
	http.setRequestHeader('X-Parse-REST-API-Key', 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk');
	http.withCredentials = false;
	http.responseType = 'json';
	http.onreadystatechange = function(response){console.log('ready:',response);};
	// http.onerror = function(reason){console.log('reason:', reason);};
	// http.onload = function(value){console.log('value:', value);};
	http.send(Type.toJson({ message:'Hihihi!' }));
	// http.abort();
	// console.log('http.status:', http.status, 'text:', http.statusText);

	var url = 'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK';
	var jsonp = new JsonPadding();
	jsonp.load(url).success(function(value){
		console.log('[JSONP]:', value);
	}, function(reason){
		console.log('[JSONP ERROR]:', reason);
	});
	// jsonp.abort();

}).call(this, Ambox);
