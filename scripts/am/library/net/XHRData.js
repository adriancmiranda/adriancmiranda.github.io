define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Class'
], function(Map, Type, Class){

	var XHRData = new Class(function XHRData(data){
		this.payload = data;
	});

	XHRData.method('transform', function(headers, status, transformRequests){
		var transformedData = null;
		// headers = XHRHeaders.proxy(headers);// transforma o `headers` em uma função que buscará todas as propriedades...
		if(Type.isFunction(transformRequests)){
			transformedData = transformRequests(this.payload, headers, status);
		}else if(Type.isArrayLike(transformRequests)){
			Map.array(transformRequests, function(request){
				transformedData = request(this.payload, headers, status);
			}, this);
		}
		return transformedData;
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