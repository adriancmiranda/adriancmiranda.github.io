/* global Ambox */
;(function (scope) {
	console.log(Ambox.banner);
	var JsonPadding = scope.uri('JsonPadding');
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

	var each = new Proto(function(object, callback, params){
		if(Type.isArrayLike(object)){
			return each.object(object, callback);
		}
		return each.array(object, callback);
	});

	each.static('object', function(object, callback){
		for(var key in object){
			if(callback.call(object[key], key, object[key]) === false){
				break;
			}
		}
		return object;
	});

	each.static('array', function(object, callback){
		for(var id = 0, total = object.length; id < total;){
			if(callback.call(object[id], id, object[id++]) === false){
				break;
			}
		}
		return object;
	});

	each.object({a:1, b:4, c:7}, function(a, b, c, d){
		console.log('1:proto:=>', a, b, c, 'args:', d);
	});

	each([1, 4, 7], function(a, b, c, d){
		console.log('2:proto:=>', a, b, c, 'args:', d);
	});

}).call(this, Ambox);
