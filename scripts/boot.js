/* global Ambox */
;(function (scope) {
	console.log(Ambox.banner);
	var JsonPadding = scope.uri('JsonPadding');
	var iterate = scope.uri('iterate');
	var Ticker = scope.uri('Ticker');
	var Proto = scope.uri('Proto');
	var Timer = scope.uri('Timer');
	var Type = scope.uri('Type');
	var URL = scope.uri('URL');

	// var url = 'https://api.parse.com/1/classes/Message'
	// var http = new Ambox.HttpRequest()
	// http.open('post', url, true)
	// // http.setRequestHeader(headers)
	// http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
	// http.setRequestHeader('X-Parse-Application-Id', 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq')
	// http.setRequestHeader('X-Parse-REST-API-Key', 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk')
	// http.withCredentials(false)
	// http.responseType('json')
	// http.onerror = onerror
	// http.onload = onload
	// http.send(Ambox.Type.toJson({ message:'Hihihi!' }))

	var url = 'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK';
	var jsonp = new JsonPadding(url).success(function(value){
		console.log('[JSONP]:', value.toObject());
	}, function(reason){
		console.log('[JSONP ERROR]:', reason);
	});

	var Ae = new Proto(function Ae(){});

	iterate({a:1, b:4, c:7}, function(value, index){
		console.log('object:=>', value, index);
	});

	iterate(Ae, function(value, index){
		console.log('Ae:=>', value, index);
	}, ['teste']);

	iterate(new Ae(), function(value, index){
		console.log('ae:=>', value, index);
	}, ['teste']);

	var a = iterate(document.querySelectorAll('.menu__list>li'), function(value, index){
		console.log('li:=>', value, index);
	});

	iterate([1, 4, 7], function(value, index){
		console.log('array:=>', value, index);
	});


	var St = new Ambox.Proto(function(){
		console.log('Static class');
	});

	St.static('methodA', function(){
		// to override
	});

	var Nr = new Ambox.Proto(function(){
		console.log('Normal class created');
	}).extends(St);

	Nr.public('teste', function(){
		console.log('Normal teste method');
	});

	console.log('\n===================================\nmethodA:', Nr.methodA);
	iterate(Nr, function(index, value, key){
		console.log('proto:', index, value, key);
	});

}).call(this, Ambox);
