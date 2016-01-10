/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Timer = scope.uri('Timer');
	var Iterator = scope.uri('Iterator');

	// HttpRequest - Adapter Pattern
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpRequest = new Proto(function HttpRequest(){
		arguments.length && this.open.apply(this, arguments);
	});

	// Factory Method
	HttpRequest.static('createXHR', function(type){
		var method = /^(get|post|head|put|delete|options)$/i;
		var legacy = document.documentMode <= 8;
		if(legacy && (!method.test(type) || !window.XMLHttpRequest)){
			return new window.ActiveXObject('Microsoft.XMLHTTP');
		}else if(window.XMLHttpRequest){
			return new window.XMLHttpRequest();
		}
		throw new Error('This browser does not support XMLHttpRequest.');
	});

	HttpRequest.charge('responseType', function(value){
		value = Type.isDefined(value)? value : '';
		try{this.client.responseType=value;}
		catch(error){if(value!=='json'){throw error;}}
	});

	HttpRequest.charge('responseType', function(){
		return this.client.responseType;
	});

	HttpRequest.charge('withCredentials', function(value){
		value && (this.client.withCredentials = value);
	});

	HttpRequest.charge('withCredentials', function(){
		return this.client.withCredentials;
	});

	HttpRequest.charge('timeout', function(ms){
		this.timer = new Timer(Type.toUint(ms) * 1000, 0, false);
	});

	HttpRequest.charge('timeout', function(){
		return this.client.timeout;
	});

	HttpRequest.public('upload', function(){
		return this.client.upload;
	});

	HttpRequest.public('responseXML', function(){
		return this.client.responseXML;
	});

	HttpRequest.public('response', function(){
		return this.client.response;
	});

	HttpRequest.public('responseText', function(){
		return this.client.responseText;
	});

	HttpRequest.public('readyState', function(){
		return this.client.readyState;
	});

	HttpRequest.public('status', function(){
		return this.client.status;
	});

	HttpRequest.public('statusText', function(){
		return this.client.statusText;
	});

	HttpRequest.public('accept', function(visitor){
	});

	HttpRequest.charge('open', function(opts){
		return this.open(opts.method, opts.url, opts.async, opts.username, opts.password);
	});

	HttpRequest.charge('open', function(method, url){
		return this.open(method, url, true, undefined, undefined);
	});

	HttpRequest.charge('open', function(method, url, async){
		return this.open(method, url, async, undefined, undefined);
	});

	HttpRequest.charge('open', function(method, url, async, username, password){
		// this.builder = new HttpRequestBuilder(this);
		// this.client = this.builder.createRequest(method);

		this.client = new window.XMLHttpRequest();
		this.client.open(method, url, async, username, password);
	});

	HttpRequest.charge('setRequestHeader', function(headers){
		new Iterator(headers).each(function(value, header){
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
	});

	HttpRequest.public('abort', function(){
		this.client.abort();
	});

	scope.uri('HttpRequest', HttpRequest);

}).call(this, Ambox);