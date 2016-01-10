/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');
	var Promise = Ambox.namespace('Promise');
	var Namespace = Ambox.namespace('Namespace');

	// JSONP implementation
	// @support IE8+ fallback
	// @see N/A yet.
	var JsonPadding = new Proto(function JsonPadding(url, callbackId){
		Proto.rebind(this, 'onResponse', 'onResult');
		if(arguments.length){
			return this.load(url, callbackId);
		}
	}).static('calls', 0);

	JsonPadding.public('load', function(url, callbackId){
		var defaultCallbackId = 'Ambox.JsonPadding.$'+(JsonPadding.calls++).toString(36);
		var hasCallbackId = Type.isString(callbackId) && callbackId.length;
		this.callbackId = hasCallbackId? callbackId : defaultCallbackId;
		this.url = String(url).replace('JSON_CALLBACK', this.callbackId);
		this.uri = Namespace.pathArray(this.callbackId);
		this.namespace = this.uri.shift();
		this.callbackUri = this.uri.join('.');
		this.instance = window[this.namespace] = window[this.namespace] || Proto.create(null);
		this.callback = Ambox.namespace;
		this.callback(this.callbackUri, this.onResult);
		this.promise = new Promise();
		this.script = document.createElement('script');
		this.script.addEventListener('load', this.onResponse);
		this.script.addEventListener('error', this.onResponse);
		this.script.type = 'text/javascript';
		this.script.async = true;
		this.script.src = this.url;
		document.body.appendChild(this.script);
		return this.promise;
	});

	JsonPadding.public('abort', function(){
		this.script && this.onResponse(undefined);
	});

	JsonPadding.public('onResult', function(response){
		this.callback(this.callbackUri +'.response', response);
		this.callback(this.callbackUri +'.called', true);
	});

	JsonPadding.public('onResponse', function(event){
		var callback = this.callback(this.callbackUri);
		this.script.removeEventListener('error', this.onResponse);
		this.script.removeEventListener('load', this.onResponse);
		document.body.removeChild(this.script);
		console.log('jsonp:', callback.response);
		// this.promise.reject(value);
		// this.promise.resolve(value);
		delete(this.script);
	});

	Ambox.namespace('JsonPadding', JsonPadding);

}).call(this, Ambox);