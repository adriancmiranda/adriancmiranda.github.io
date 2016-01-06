/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');
	var Timer = Ambox.namespace('Timer');
	var Iterator = Ambox.namespace('Iterator');
	var EventProxy = Ambox.namespace('EventProxy');

	// HttpRequest - Adapter Pattern
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpRequest = new Proto(function HttpRequest(){
		arguments.length && this.open.apply(this, arguments);
	});

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
		try{this.client.target.responseType=value;}
		catch(error){if(value!=='json'){throw error;}}
	});

	HttpRequest.charge('responseType', function(){
		return this.client.target.responseType;
	});

	HttpRequest.charge('withCredentials', function(value){
		value && (this.client.target.withCredentials = value);
	});

	HttpRequest.charge('withCredentials', function(){
		return this.client.target.withCredentials;
	});

	HttpRequest.charge('timeout', function(ms){
		this.timer = new Timer(Type.toUint(ms) * 1000, 0, false);
	});

	HttpRequest.charge('timeout', function(){
		return this.client.target.timeout;
	});

	HttpRequest.public('upload', function(){
		return this.client.target.upload;
	});

	HttpRequest.public('responseXML', function(){
		return this.client.target.responseXML;
	});

	HttpRequest.public('response', function(){
		return this.client.target.response;
	});

	HttpRequest.public('responseText', function(){
		return this.client.target.responseText;
	});

	HttpRequest.public('readyState', function(){
		return this.client.target.readyState;
	});

	HttpRequest.public('status', function(){
		return this.client.target.status;
	});

	HttpRequest.public('statusText', function(){
		return this.client.target.statusText;
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

		this.client = new EventProxy(new window.XMLHttpRequest());
		this.client.target.open(method, url, async, username, password);
	});

	HttpRequest.charge('setRequestHeader', function(headers){
		new Iterator(headers).each(function(value, header){
			this.setRequestHeader(header, value);
		});
	});

	HttpRequest.charge('setRequestHeader', function(header, value){
		if(Type.isString(header) && Type.isString(value)){
			this.client.target.setRequestHeader(header.trim(), value.trim());
		}
	});

	HttpRequest.public('getAllResponseHeaders', function(){
		return this.client.target.getAllResponseHeaders();
	});

	HttpRequest.public('getResponseHeader', function(header){
		return this.client.target.getResponseHeader(header);
	});

	HttpRequest.public('overrideMimeType', function(mimetype){
		this.client.target.overrideMimeType(mimetype);
	});

	HttpRequest.public('send', function(data){
		this.client.target.send(Type.isDefined(data)? data:null);
	});

	HttpRequest.public('abort', function(){
		this.client.target.abort();
	});

	Ambox.namespace('HttpRequest', HttpRequest);

}).call(this, Ambox);