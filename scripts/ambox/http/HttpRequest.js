/* global Ambox */
(function(scope){
	var HttpEvent = scope.uri('HttpEvent');
	var Promise = scope.uri('Promise');
	var iterate = scope.uri('iterate');
	var Proto = scope.uri('Proto');
	var Type = scope.uri('Type');

	// HttpRequest - Adapter Pattern
	// @support IE9+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest (wrong for IE9 actually)
	// @see http://kangax.github.io/compat-table/es5/#test-String.prototype.trim
	var HttpRequest = new Proto(function HttpRequest(){
		Proto.rebind(this, 'onReadyStateChange', 'onLoad', 'onError', 'onAbort', 'onTimeout');
	});

	// Factory Method
	HttpRequest.static('createXHR', function(type){
		if(window.XMLHttpRequest){
			return new window.XMLHttpRequest();
		}
		throw new Error('This browser does not support XMLHttpRequest.');
	})

	HttpRequest.static({
		UNSENT:0,
		OPENED:1,
		HEADERS_RECEIVED:2,
		LOADING:3,
		DONE:4
	});

	HttpRequest.define('responseType', {
		set:function(value){
			value = Type.isDefined(value)? value : '';
			try{
				this.client.responseType = value;
			}catch(error){
				if(value !== 'json'){
					throw error;
				}
			}
		},
		get:function(){
			return this.client.responseType;
		}
	});

	HttpRequest.define('withCredentials', {
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

	HttpRequest.define('timeout', {
		set:function(milliseconds){
			this._timeout = Type.toUint(milliseconds);
		},
		get:function(){
			return this._timeout||0;
		}
	});

	HttpRequest.define('upload', {
		get:function(){
			return this.client.upload;
		}
	});

	HttpRequest.define('responseXML', {
		get:function(){
			return this.client.responseXML;
		}
	});

	HttpRequest.define('response', {
		get:function(){
			return this.client.response;
		}
	});

	HttpRequest.define('responseText', {
		get:function(){
			return this.client.responseText;
		}
	});

	HttpRequest.define('readyState', {
		get:function(){
			return this.client.readyState;
		}
	});

	HttpRequest.define('status', {
		get:function(){
			return this.client.status;
		}
	});

	HttpRequest.define('statusText', {
		get:function(){
			return this.client.statusText;
		}
	});

	HttpRequest.public('open', function(method, url, async, username, password){
		this.url = url;
		this.client = HttpRequest.createXHR(method);
		this.client.onreadystatechange = this.onReadyStateChange;
		this.client.onerror = this.onError;
		this.client.onabort = this.onAbort;
		this.client.onload = this.onLoad;
		this.client.open(method, url, async, username, password);
	});

	HttpRequest.charge('setRequestHeader', function(headers){
		iterate.property(headers, function(value, header){
			this.setRequestHeader(header, value);
		});
	});

	HttpRequest.charge('setRequestHeader', function(header, value){
		if(Type.isString(header) && Type.isString(value)){
			this.client.setRequestHeader(header.trim(), value.trim());
		}
	});

	HttpRequest.public('getAllResponseHeaders', function(){
		return this.client.getAllResponseHeaders();
	});

	HttpRequest.public('getResponseHeader', function(header){
		return this.client.getResponseHeader(header);
	});

	HttpRequest.public('overrideMimeType', function(mimetype){
		this.client.overrideMimeType(mimetype);
	});

	HttpRequest.public('send', function(data){
		this.client.send(Type.isDefined(data)? data : null);
		if(this.timeout > 0){
			this.timer = window.setTimeout(this.onTimeout, this.timeout);
		}
	});

	HttpRequest.public('abort', function(){
		HttpRequest.ABORTED = true;
		this.client.abort();
		delete(HttpRequest.ABORTED);
	});

	HttpRequest.public('onReadyStateChange', function(){
		window.clearTimeout(this.timer);
		var event, cli = this.client;
		if(cli && cli.readyState == 4){
			var text = null;
			var headers = null;
			var statusText = '';
			var status = HttpRequest.ABORTED? -1 : cli.status;
			var msie = document.documentMode;
			if(!HttpRequest.ABORTED){
				headers = cli.getAllResponseHeaders();
				text = 'response' in cli? cli.response : cli.responseText;
			}
			if(HttpRequest.ABORTED && msie > 9 || !msie){
				statusText = cli.statusText;
			}
			event = new HttpEvent(text, headers, status, statusText, this.url);
			this.onreadystatechange && this.onreadystatechange(event);
		}
	});

	HttpRequest.public('onLoad', function(){
		window.clearTimeout(this.timer);
		var cli = this.client;
		var text = 'response' in cli? cli.response : cli.responseText;
		var headers = cli.getAllResponseHeaders();
		var event = new HttpEvent(text, headers, cli.status, cli.statusText, this.url);
		if(200 <= event.status && event.status < 300){
			this.onload && this.onload(event);
		}else{
			this.onerror && this.onerror(event);
		}
	});

	HttpRequest.public('onError', function(){
		window.clearTimeout(this.timer);
		this.onerror && this.onerror(new HttpEvent(null, null, -1, '', this.url));
	});

	HttpRequest.public('onAbort', function(){
		this.onabort && this.onabort(new HttpEvent(null, null, -1, '', this.url));
	});

	HttpRequest.public('onTimeout', function(){
		this.abort();
		this.ontimeout && this.ontimeout(new HttpEvent(null, null, -1, '', this.url));
	});

	scope.uri('HttpRequest', HttpRequest);

}).call(this, Ambox);