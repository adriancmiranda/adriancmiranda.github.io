define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Class'
], function(Map, Type, Class){

	var HttpData = new Class(function HttpData(data, headers, status, statusText, params){
		this.params = Class.options({}, params);
		this.data = data;
		this.headers = headers;
		this.status = status;
		this.statusText = statusText;
	});

	HttpData.static('defaultHttpResponseTransform', function(data, headers){
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

	HttpData.static('defaultHttpRequestTransform', function(data){
		if(Type.isFile(data) || Type.isBlob(data) || Type.isFormData(data)){
			return data;
		}
		return Type.toJSON(data);
	});

	HttpData.static('defaults', {
		transformRequest:[HttpData.defaultHttpRequestTransform],
		transformResponse:[HttpData.defaultHttpResponseTransform]
	});

	HttpData.define('status', {
		set:function(value){
			this._status = Type.toInt(value);
			this._status = this._status === 1223? 204:this._status;
			if(this._status === 0){
				this._status = this.data? 200:this.params.url.protocol === 'file'? 404:0;
			}
		},
		get:function(){
			return this._status;
		}
	});

	HttpData.define('statusText', {
		set:function(value){
			this._statusText = Type.isString(value)? value:'';
		},
		get:function(){
			return this._statusText;
		}
	});

	HttpData.method('transform', function(requests){
		var data = this.toArray();
		var params = Type.toArray(arguments, 1);
		if(Type.isFunction(requests)){
			data[0] = requests.apply(requests, data.concat(params));
		}else if(Type.isArrayLike(requests)){
			Map.array(requests, function(request){
				if(Type.isFunction(request)){
					data[0] = request.apply(request, data.concat(params));
				}
			});
		}
		return data[0];
	});

	HttpData.method('toArray', function(){
		return([this.data, this.headers, this.status, this.statusText]);
	});

	HttpData.method('toObject', function(){
		return({ data:this.data, headers:this.headers, status:this.status, statusText:this.statusText });
	});

	HttpData.method('toString', function(){
		return Type.toJSON(this.toObject());
	});

	return HttpData;
});