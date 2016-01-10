/* global Ambox */
;(function (scope) {
	console.log(Ambox.banner);
	var JsonPadding = scope.uri('JsonPadding');
	var Ticker = scope.uri('Ticker');
	var Proto = scope.uri('Proto');
	var Timer = scope.uri('Timer');
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

	var url = 'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK'
	// // var http = new HttpRequest()
	// // http.open('jsonp', url, true)
	// // http.callbackId('onGetJsonp')
	// // http.responseType('json')
	// // http.send()
	var jsonp = new JsonPadding().load(url).success(function(value){
		console.log('[JSONP]:', value.toObject());
	}, function(reason){
		console.log('[JSONP ERROR]:', reason);
	});

	// scope.onGetJsonp = function onload(data){
	// 	console.log('value:', data)
	// }

	// function onerror(data){
	// 	console.log('reason:', data)
	// }
	// var url = new URL('http://your.domain/product.aspx?category=4&product_id=2140&query=lcd')
	// var a = function(timer){
	// 	console.log('=>', timer.currentCount, timer.duration/1000, Ticker.FPS)
	// }
	// var timer = new Timer(1000, 4, false)
	// timer.on('update', a)
	// timer.start()
	// Ticker.add(a)
	// window.setTimeout(function(){Ticker.remove(a)}, 2000)
	// var req = Ticker.setRequest(a)
	// console.log('req:', req)
	// window.setTimeout(function(){Ticker.clearRequest();}, 2000)

	console.log(Proto.keys({ a:'teste', b:1, c:{ c1:2, c2:3, c3:4 } }));
	console.log(Proto.keys('teste'));

	var eachImpl = function (object, callback, args) {
		var name, i = 0,
		length = object.length,
		isObj = length === undefined || typeof (object) === 'function'
		if(args){
			if(isObj){
				for(name in object){
					if(callback.apply(object[ name ], args) === false){
						break;
					}
				}
			}else{
				for(; i < length;){
					if(callback.apply(object[ i++ ], args) === false){
						break;
					}
				}
			}
		}else{// A special, fast, case for the most common use of each
			if(isObj){
				for(name in object){
					if(callback.call(object[ name ], name, object[ name ]) === false){
						break;
					}
				}
			}else{
				for(; i < length;){
					if(callback.call(object[ i ], i, object[ i++ ]) === false){
						break;
					}
				}
			}
		}
		return object;
	};

	var each = function(callback, args){
		eachImpl(this, callback, args);
	};

	eachImpl({a:1, b:4, c:7}, function(a, b, c, d){
		console.log('impl:=>', a, b, c, 'args:', d);
	});

	eachImpl([1, 4, 7], function(a, b, c, d){
		console.log('impl:=>', a, b, c, 'args:', d);
	});

	each([1, 2, 4], function(a, b, c, d){
		console.log('each:=>', a, b, c, 'args:', d);
	}, ['a', 'b', 'c']);

}).call(this, Ambox);
