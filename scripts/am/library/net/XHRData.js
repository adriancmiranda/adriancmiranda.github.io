define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Class'
], function(Map, Type, Class){

	var XHRData = new Class(function XHRData(data, headers, status, transformRequests){
		this.data = Class.options({}, data);
		this.headers = Class.options({}, headers);
		this.transformRequest = transformRequests;
		this.status = status;
	});

	XHRData.method('transform', function(){
		var transformedData;
		if(Type.isFunction(this.transformRequests)){
			transformedData = this.transformRequests(this.data, this.headers, this.status);
		}else if(Type.isArrayLike(this.transformRequests)){
			Map.array(this.transformRequests, function(request){
				transformedData = request(this.data, this.headers, this.status);
			});
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