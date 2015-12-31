define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Class'
], function(Map, Type, Class){

	var XHRData = new Class(function XHRData(data){
		this.payload = data;
	});

	XHRData.method('transform', function(requests){
		var payload = Class.options({}, this.payload);
		var params = Type.toArray(arguments, 1);
		if(Type.isFunction(requests)){
			payload = requests.apply(requests, [payload].concat(params));
		}else if(Type.isArrayLike(requests)){
			Map.array(requests, function(request){
				if(Type.isFunction(request)){
					payload = request.apply(request, [payload].concat(params));
				}else{
					payload = request;
				}
			});
		}
		return payload;
	});

	XHRData.static('defaultHttpRequestTransform', function(data){
		if(Type.isFile(data) || Type.isBlob(data) || Type.isFormData(data)){
			return data;
		}
		return Type.toJSON(data);
	});

	XHRData.static('defaultHttpResponseTransform', function(data, headers){
		if(Type.isString(data)){
			var tempData = data.replace(patterns.jsonProtectionPrefix, '').trim();
			if(tempData){
				var contentType = headers('Content-Type');
				if((contentType && (contentType.indexOf('application/json') === 0)) || Type.isJSONLike(tempData)){
					data = Type.fromJSON(tempData);
				}
			}
		}
		return data;
	});

	XHRData.defaults = {
		transformRequest:[XHRData.defaultHttpRequestTransform],
		transformResponse:[XHRData.defaultHttpResponseTransform]
	};

	return XHRData;
});