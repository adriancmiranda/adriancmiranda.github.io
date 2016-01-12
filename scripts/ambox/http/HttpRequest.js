/* global Ambox */
(function(scope){
	var HttpData = scope.uri('HttpData');
	var Promise = scope.uri('Promise');
	var iterate = scope.uri('iterate');
	var Proto = scope.uri('Proto');
	var Timer = scope.uri('Timer');
	var Type = scope.uri('Type');

	// HttpRequest - Adapter Pattern
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest (wrong for IE9 actually)
	var HttpRequest = new Proto(function HttpRequest(){
		Proto.rebind(this, 'onLoad', 'onAbort', 'onError', 'onReadyStateChange', 'onTimeout');
		this.timeout = 0;
		arguments.length && this.open.apply(this, arguments);
	});

	// Factory Method
	HttpRequest.static('createRequest', function(type){
		var method = /^(get|post|head|put|delete|options)$/i;
		var legacy = document.documentMode <= 8;
		if(legacy && (!method.test(type) || !window.XMLHttpRequest)){
			return new window.ActiveXObject('Microsoft.XMLHTTP');
		}else if(window.XMLHttpRequest){
			return new window.XMLHttpRequest();
		}
		throw new Error('This browser does not support XMLHttpRequest.');
	});

	HttpRequest.define('responseType', {
		set:function(value){
			value = Type.isDefined(value)? value : '';
			try{this.client.responseType=value;}
			catch(error){if(value!=='json'){throw error;}}
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
			return this._timeout;
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
		this.client = HttpRequest.createRequest(method);
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
		this.client.send(Type.isDefined(data)? data:null);
		if(this.timeout > 0){
			this.timer = new Timer(this.timeout * 1000, 1, false);
			this.timer.on(Timer.COMPLETE, this.onTimeout);
			this.timer.start();
		}
	});

	HttpRequest.public('abort', function(){
		HttpRequest.ABORTED = true;
		this.client.abort();
	});

	HttpRequest.public('onReadyStateChange', function(){
		if(this.client && this.client.readyState == 4){
			var headers = null, text = null, status, statusText = '', cli = this.client;
			if(!HttpRequest.ABORTED){
				headers = cli.getAllResponseHeaders();
				text = 'response' in cli? cli.response : cli.responseText;
			}
			if(!(HttpRequest.ABORTED && document.documentMode < 10)){
				statusText = cli.statusText;
			}
			status = HttpRequest.ABORTED? -1 : this.client.status;
			delete(HttpRequest.ABORTED);
			var data = new HttpData(text, headers, status, statusText, this.url);
			this.onreadystatechange && this.onreadystatechange(data.toObject());
		}
	});

	HttpRequest.public('onLoad', function(){
		this.timer && this.timer.stop() && this.timer.flush();
		var cli = this.client;
		var text = 'response' in cli? cli.response:cli.responseText;
		var headers = cli.getAllResponseHeaders();
		var data = new HttpData(text, headers, cli.status, cli.statusText, this.url);
		// data.data = data.transform(this.options.transformResponse);
		if(200 <= data.status && data.status < 300){
			this.onload && this.onload(data.toObject());
		}else{
			this.onerror && this.onerror(data.toObject());
		}
	});

	HttpRequest.public('onError', function(){
		this.timer && this.timer.stop() && this.timer.flush();
		var reason = new HttpData(null, null, -1, '', this.url);
		this.onerror && this.onerror(reason.toObject());
	});

	HttpRequest.public('onAbort', function(){
		var reason = new HttpData(null, null, -1, '', this.url);
		this.onabort && this.onabort(reason.toObject());
	});

	HttpRequest.public('onTimeout', function(){
		this.abort();
		this.ontimeout && this.ontimeout(this.client);
	});

	scope.uri('HttpRequest', HttpRequest);

}).call(this, Ambox);