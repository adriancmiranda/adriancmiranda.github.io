/* global Ambox */
(function(scope){
	var HttpHeaders = scope.uri('HttpHeaders');
	var HttpEvent = scope.uri('HttpEvent');
	var patterns = scope.uri('patterns');
	var Promise = scope.uri('Promise');
	var iterate = scope.uri('iterate');
	var Proto = scope.uri('Proto');
	var Type = scope.uri('Type');

	// HttpRequestBuilder
	// @support IE9+ fallback
	var HttpRequestBuilder = new Proto(function HttpRequestBuilder(httpRequest){
		this.promise = new Promise();
		this.request = httpRequest;
	});

	HttpRequestBuilder.charge('load', function(options){
		return Type.isObjectLike(options) &&
		this.load(options, options.headers) || this.promise;
	});

	HttpRequestBuilder.charge('load', function(options, headers){
		headers = headers || {};
		return Type.isObjectLike(options) && Type.isObjectLike(headers) &&
		this.load(options.url, options, headers) || this.promise;
	});

	HttpRequestBuilder.charge('load', function(url, options, headers){
		return Type.isString(url) && Type.isObjectLike(options) && Type.isObjectLike(headers) &&
		this.load(url, options.data, options, headers) || this.promise;
	});

	HttpRequestBuilder.charge('load', function(url, data, options, headers){
		headers = HttpHeaders(headers, data, options.method, options);
		data = new HttpEvent(data, HttpHeaders.proxy(headers), 0, '', url);
		this.request.open(options.method, url, options.async, options.username, options.password);
		this.request.setRequestHeader(headers);
		this.request.onload = this.promise.resolve;
		this.request.onabort = this.promise.reject;
		this.request.onerror = this.promise.reject;
		this.request.ontimeout = this.promise.reject;
		this.request.withCredentials = options.withCredentials;
		this.request.responseType = options.responseType;
		this.request.timeout = options.timeout;
		this.request.send(data.transform(options.transformRequest));
		return this.promise;
	});

	// HttpRequestProxy
	// @support IE9+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest (wrong for IE9 actually)
	var HttpRequestProxy = new Proto(function HttpRequestProxy(xhr, options){
		Proto.rebind(this, 'onLoad', 'onAbort', 'onError', 'onTimeout');
		this.client = xhr;
		this.options = Proto.merge({}, options);
		if(arguments.length){
			return new HttpRequestBuilder(this);
		}
	});

	HttpRequestProxy.static({
		UNSENT:0,
		OPENED:1,
		HEADERS_RECEIVED:2,
		LOADING:3,
		DONE:4
	});

	HttpRequestProxy.define('responseType', {
		set:function(value){
			if(value){
				try{
					this.client.responseType = value;
				}catch(error){
					if(value !== 'json'){
						throw error;
					}
				}
			}
		},
		get:function(){
			return this.client.responseType;
		}
	});

	HttpRequestProxy.define('withCredentials', {
		set:function(value){
			value = Type.toBoolean(value);
			if(value){
				this.client.withCredentials = value;
			}
		},
		get:function(){
			return this.client.withCredentials;
		}
	});

	HttpRequestProxy.define('timeout', {
		set:function(milliseconds){
			this._timeout = Type.toUint(milliseconds);
		},
		get:function(){
			return this._timeout||0;
		}
	});

	HttpRequestProxy.define('upload', {
		get:function(){
			return this.client.upload;
		}
	});

	HttpRequestProxy.define('responseXML', {
		get:function(){
			return this.client.responseXML;
		}
	});

	HttpRequestProxy.define('response', {
		get:function(){
			return this.client.response;
		}
	});

	HttpRequestProxy.define('responseText', {
		get:function(){
			return this.client.responseText;
		}
	});

	HttpRequestProxy.define('readyState', {
		get:function(){
			return this.client.readyState;
		}
	});

	HttpRequestProxy.define('status', {
		get:function(){
			return this.client.status;
		}
	});

	HttpRequestProxy.define('statusText', {
		get:function(){
			return this.client.statusText;
		}
	});

	HttpRequestProxy.public('open', function(method, url, async, username, password){
		this.url = url;
		this.client.open(method, url, async, username, password);
		this.client.onreadystatechange = this.onReadyStateChange;
		this.client.onerror = this.onError;
		this.client.onabort = this.onAbort;
		this.client.onload = this.onLoad;
	});

	HttpRequestProxy.charge('setRequestHeader', function(headers){
		iterate.property(headers, function(value, header){
			this.setRequestHeader(header, value);
		}, this);
	});

	HttpRequestProxy.charge('setRequestHeader', function(header, value){
		if(Type.isString(header) && Type.isString(value)){
			this.client.setRequestHeader(header.trim(), value.trim());
		}
	});

	HttpRequestProxy.public('getAllResponseHeaders', function(){
		return this.client.getAllResponseHeaders();
	});

	HttpRequestProxy.public('getResponseHeader', function(header){
		return this.client.getResponseHeader(header);
	});

	HttpRequestProxy.public('overrideMimeType', function(mimetype){
		this.client.overrideMimeType(mimetype);
	});

	HttpRequestProxy.public('send', function(data){
		this.client.send(Type.isDefined(data)? data : null);
		if(this.timeout > 0){
			this.timer = window.setTimeout(this.onTimeout, this.timeout);
		}
	});

	HttpRequestProxy.public('abort', function(){
		HttpRequestProxy.ABORTED = true;
		this.client.abort();
		delete(HttpRequestProxy.ABORTED);
	});

	HttpRequestProxy.public('onReadyStateChange', function(){
		window.clearTimeout(this.timer);
		var event, cli = this.client;
		if(cli && cli.readyState == 4){
			var text = null;
			var headers = null;
			var statusText = '';
			var status = HttpRequestProxy.ABORTED? -1 : cli.status;
			var msie = document.documentMode;
			if(!HttpRequestProxy.ABORTED){
				headers = cli.getAllResponseHeaders();
				text = 'response' in cli? cli.response : cli.responseText;
			}
			if(!(HttpRequestProxy.ABORTED && msie < 10)){
				statusText = cli.statusText;
			}
			event = new HttpEvent(text, headers, status, statusText, this.url);
			this.onreadystatechange && this.onreadystatechange(event);
		}
	});

	HttpRequestProxy.public('onLoad', function(){
		window.clearTimeout(this.timer);
		var cli = this.client;
		var text = 'response' in cli? cli.response : cli.responseText;
		var headers = HttpHeaders.proxy(cli.getAllResponseHeaders());
		var event = new HttpEvent(text, headers, cli.status, cli.statusText, this.url);
		event.info = event.transform(this.options.transformResponse);
		this.onreadystatechange && this.onreadystatechange(new HttpEvent(null, null, -1, '', this.url));
		if(200 <= event.status && event.status < 300){
			this.onload && this.onload(event);
		}else{
			this.onerror && this.onerror(event);
		}
	});

	HttpRequestProxy.public('onError', function(){
		window.clearTimeout(this.timer);
		this.onreadystatechange && this.onreadystatechange(new HttpEvent(null, null, -1, '', this.url));
		this.onerror && this.onerror(new HttpEvent(null, null, -1, '', this.url));
	});

	HttpRequestProxy.public('onAbort', function(){
		this.onreadystatechange && this.onreadystatechange(new HttpEvent(null, null, -1, '', this.url));
		this.onabort && this.onabort(new HttpEvent(null, null, -1, '', this.url));
	});

	HttpRequestProxy.public('onTimeout', function(){
		this.abort();
		this.onreadystatechange && this.onreadystatechange(new HttpEvent(null, null, -1, '', this.url));
		this.ontimeout && this.ontimeout(new HttpEvent(null, null, -1, '', this.url));
	});

	scope.uri('HttpRequest', HttpRequestProxy);

}).call(this, Ambox);