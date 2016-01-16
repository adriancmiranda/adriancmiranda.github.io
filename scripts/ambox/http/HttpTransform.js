/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var iterate = scope.uri('iterate');
	var patterns = scope.uri('patterns');

	// HttpTransform
	// @support everywhere
	var HttpTransform = new Proto(function HttpTransform(requests, params){
		var data;
		if(Type.isFunction(requests)){
			data = requests.apply(requests, params);
		}else if(Type.isArrayLike(requests)){
			iterate.index(requests, function(request){
				if(Type.isFunction(request)){
					data = request.apply(request, params);
				}
			});
		}
		return data;
	});

	HttpTransform.static('request', function(data){
		return Type.test('File|Blob|FormData', data, true)? data : Type.toJson(data);
	});

	HttpTransform.static('response', function(data, headers){
		if(Type.isString(data)){
			var tempData = data.replace(patterns.jsonProtectionPrefix, '').trim();
			if(tempData){
				var contentType = headers('Content-Type');
				if((contentType && (contentType.indexOf('application/json') === 0)) || Type.isJsonLike(tempData)){
					data = Type.fromJson(tempData);
				}
			}
		}
		return data;
	});

	scope.uri('HttpTransform', HttpTransform);

}).call(this, Ambox);