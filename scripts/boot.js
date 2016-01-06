/* global Ambox */
(function(scope){

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

	// Ambox.Ticker.add(function(delta){
	// 	console.log('delta:', delta);
	// });

	var timer = new Ambox.Timer(20, 100, true);

	timer.on('start', function(){
		console.log('[started]:', true);
	});
	timer.on('update', function(){
		console.log('[updated]:', true);
	});
	timer.on('stop', function(){
		console.log('[stoped]:', true);
	});
	timer.on('reset', function(){
		console.log('[reseted]:', true);
	});
	timer.on('complete', function(){
		console.log('[completed]:', true);
	});

	timer.start();

}).call(this, this);