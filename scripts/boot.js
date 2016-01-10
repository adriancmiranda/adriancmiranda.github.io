/* global Ambox */
(function(scope){
	console.log(Ambox.banner);
	var Ticker = Ambox.namespace('Ticker');
	var Timer = Ambox.namespace('Timer');
	var URL = Ambox.namespace('URL');

	// var url = 'https://api.parse.com/1/classes/Message';
	// var http = new Ambox.HttpRequest();
	// http.open('post', url, true);
	// // http.setRequestHeader(headers);
	// http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	// http.setRequestHeader('X-Parse-Application-Id', 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq');
	// http.setRequestHeader('X-Parse-REST-API-Key', 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk');
	// http.withCredentials(false);
	// http.responseType('json');
	// http.onerror = onerror;
	// http.onload = onload;
	// http.send(Ambox.Type.toJson({ message:'Hihihi!' }));

	// // var url = 'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK';
	// // var http = new HttpRequest();
	// // http.open('jsonp', url, true);
	// // http.callbackId('onGetJsonp');
	// // http.responseType('json');
	// // http.send();

	// scope.onGetJsonp = function onload(data){
	// 	console.log('value:', data);
	// };

	// function onerror(data){
	// 	console.log('reason:', data);
	// };
	var url = new URL('http://your.domain/product.aspx?category=4&product_id=2140&query=lcd');
	var a = function(timer){
		console.log('=>', timer.currentCount, timer.duration/1000, Ticker.FPS);
	};
	var timer = new Timer(1000, 4, false);
	timer.on('update', a);
	timer.start();
	// Ticker.add(a);
	// window.setTimeout(function(){Ticker.remove(a)}, 2000);
	// var req = Ticker.setRequest(a);
	// console.log('req:', req);
	// window.setTimeout(function(){Ticker.clearRequest();}, 2000);

}).call(this, this);