/* global Ambox */
(function(scope){
	var each = scope.uri('each');
	var URL = scope.uri('URL');
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');

	// HttpData
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpData = new Proto(function HttpData(data, headers, status, statusText, url){
		this.data = data;
		this.headers = headers;
		this.status = status;
		this.statusText = statusText;
		this.url = url;
	});

	HttpData.define('url', {
		set:function(value){
			this._url = new URL(value);
		},
		get:function(){
			return this._url;
		}
	});

	HttpData.define('status', {
		set:function(value){
			this._status = Type.toInt(value);
			this._status = this._status === 1223? 204 : this._status;
			if(this._status === 0){
				this._status = this.data? 200 : this.url.protocol === 'file'? 404 : 0;
			}
		},
		get:function(){
			return this._status;
		}
	});

	HttpData.define('statusText', {
		set:function(value){
			this._statusText = Type.isString(value)? value : '';
		},
		get:function(){
			return this._statusText;
		}
	});

	HttpData.public('transform', function(requests){
		var data = this.toArray();
		var params = Type.toArray(arguments, 1);
		if(Type.isFunction(requests)){
			data[0] = requests.apply(requests, data.concat(params));
		}else if(Type.isArrayLike(requests)){
			each.array(requests, function(request){
				if(Type.isFunction(request)){
					data[0] = request.apply(request, data.concat(params));
				}
			});
		}
		return data[0];
	});

	HttpData.public('toArray', function(){
		return([this.data, this.headers, this.status, this.statusText]);
	});

	HttpData.public('toObject', function(){
		return({ data:this.data, headers:this.headers, status:this.status, statusText:this.statusText });
	});

	HttpData.public('toString', function(){
		return Type.toJSON(this.toObject());
	});

	scope.uri('HttpData', HttpData);

}).call(this, Ambox);