/* global Ambox */
;(function (scope) {
	console.log(Ambox.banner);

	var http = scope.uri('http');
	var JsonPadding = scope.uri('JsonPadding');
	var HttpRequest = scope.uri('HttpRequest');
	var iterate = scope.uri('iterate');
	var Ticker = scope.uri('Ticker');
	var Proto = scope.uri('Proto');
	var Timer = scope.uri('Timer');
	var Type = scope.uri('Type');
	var URL = scope.uri('URL');

	var urlP = 'https://api.parse.com/1/classes/Message';
	var urlM = 'data/mock.json';
	var urlR = 'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK';

	http.defaults.transformResponse.push(function(info){
		info.aeaeaea = true;
		return info;
	});

	http.post(urlP, { hello: 'world0' }, {
		timeout:5000,
		headers:{
			'X-Parse-Application-Id': 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq',
			'X-Parse-REST-API-Key': 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk'
		}
	}).then(function(value){
		console.log('[POST]:', value);
	}).catch(function(reason){
		console.log('[POST ERROR]:', reason);
	});

	http.post(urlP, { hello: 'world1' }, {
		timeout:5000,
		headers:{
			'X-Parse-Application-Id': 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq',
			'X-Parse-REST-API-Key': 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk'
		}
	}).then(function(value){
		console.log('[POST]:', value);
	}).catch(function(reason){
		console.log('[POST ERROR]:', reason);
	});

	http.post(urlP, { hello: 'world2' }, {
		timeout:5000,
		headers:{
			'X-Parse-Application-Id': 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq',
			'X-Parse-REST-API-Key': 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk'
		}
	}).then(function(value){
		console.log('[POST]:', value);
	}).catch(function(reason){
		console.log('[POST ERROR]:', reason);
	});

	// http.request();
	// http.get();
	// http.delete();
	// http.head();
	// http.jsonp();
	// http.post({url:'teste'});
	// http.put();
	// http.patch();

	// new HttpRequest({
	// 	url:url,
	// 	async:'bla',
	// 	data:{ message:'Uowww!' },
	// 	transformRequest:[
	// 		HttpRequest.defaultTransformRequest,
	// 		function(data, headers, status, statusText, url){
	// 			console.log('headers:', headers('async'));
	// 			return data;
	// 		}
	// 	],
	// 	transformResponse:[
	// 		HttpRequest.defaultTransformResponse,
	// 		function(data, headers, status, statusText, url){
	// 		}
	// 	]
	// }).then(function(value){
	// 	console.log('value:', value);
	// }).catch(function(reason){
	// 	console.log('reason:', reason);
	// });
	// var http = new XMLHttpRequest();
	// http.open('post', url, true);
	// http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	// http.setRequestHeader('X-Parse-Application-Id', 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq');
	// http.setRequestHeader('X-Parse-REST-API-Key', 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk');
	// http.withCredentials = false;
	// http.responseType = 'json';
	// http.onreadystatechange = function(reason){console.log('readystate:', reason);};
	// http.onabort = function(reason){console.log('aborted:', reason);};
	// http.onerror = function(reason){console.log('reason:', reason);};
	// http.onload = function(value){console.log('value:', value);};
	// http.send(Type.toJson({ message:'Hihihi!' }));
	// http.abort();
	// console.log('http.status:', http.status, 'text:', http.statusText);

	// var url = 'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK';
	// var jsonp = new JsonPadding();
	// jsonp.load(url).then(function(value){
	// 	console.log('[JSONP]:', value.data);
	// }, function(reason){
	// 	console.log('[JSONP ERROR]:', reason);
	// });
	// jsonp.abort();

}).call(this, Ambox);
