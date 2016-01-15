/* global Ambox */
(function(scope){
	var URL = scope.uri('URL');
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var iterate = scope.uri('iterate');

	// HttpEvent
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpEvent = new Proto(function HttpEvent(data, headers, status, statusText, url){
		this.url = new URL(url);
		this.data = data;
		this.headers = headers;
		this.statusText = Type.isString(statusText)? statusText : '';
		this.status = Type.toInt(status);
		this.status = this.status === 1223? 204 : this.status;
		if(this.status === 0){
			this.status = this.data? 200 : this.url.protocol === 'file'? 404 : 0;
		}
	});

	HttpEvent.public('transform', function(requests){
		var data = this.toArray();
		var params = Type.toArray(arguments, 1);
		if(Type.isFunction(requests)){
			data[0] = requests.apply(requests, data.concat(params));
		}else if(Type.isArrayLike(requests)){
			iterate.index(requests, function(request){
				if(Type.isFunction(request)){
					data[0] = request.apply(request, data.concat(params));
				}
			});
		}
		return data[0];
	});

	HttpEvent.public('toArray', function(){
		return([this.data, this.headers, this.status, this.statusText, this.url]);
	});

	HttpEvent.public('toString', function(){
		return Type.toJson(this);
	});

	scope.uri('HttpEvent', HttpEvent);

}).call(this, Ambox);
