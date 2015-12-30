define([
	'../utils/Map',
	'../utils/Scope',
	'../utils/Class',
	'../utils/Promise',
	'../events/EventProxy'
], function(Map, Scope, Class, Promise, EventProxy){

	var JSONP = new Class(function JSONP(){
		Class.proxyfy(this, 'onResponse', 'onResult');
		this.legacy = document.documentMode <= 8;
		this.script = new EventProxy(document.createElement('script'));
		this.script.target.type = 'text/javascript';
		this.script.target.async = true;
	}).static('calls', 0);

	JSONP.method('load', function(url, callbackId){
		var hasCallbackId = Type.isString(callbackId) && callbackId.length;
		callbackId = hasCallbackId? callbackId:'JSONP._'+(JSONP.calls++).toString(36);
		this.uri = Scope.pathArray(callbackId);
		this.namespace = this.uri.shift();
		this.callbackUri = this.uri.join('.');
		window[this.namespace] = window[this.namespace] || {};
		this.callback = Scope.register(window[this.namespace]);
		this.callback(this.callbackUri, this.onResult);
		this.promise = new Promise();
		this.script.target.src = String(url).replace('JSON_CALLBACK', callbackId);
		this.script.once('load', this.onResponse);
		this.script.once('error', this.onResponse);
		this.legacy && this.promise.then(this.bequeath);
		document.body.appendChild(this.script.target);
		return this.promise;
	});

	JSONP.method('onResponse', function(event){
		document.body.removeChild(this.script.target);
		delete this.script.target;
		delete this.script;
		var callback = this.callback(this.callbackUri);
		var status = -1;
		var text = 'unknown';
		if(event){
			if(event.type === 'load' && !callback.called){
				event = { type:'error' };
			}
			text = event.type;
			status = event.type === 'error'? 404:200;
		}
		this.promise.resolve({ status:status, text:text, data:callback.data });
		this.flush();
	});

	JSONP.method('onResult', function(data){
		this.callback(this.callbackUri+'.data', data);
		this.callback(this.callbackUri+'.called', true);
	});

	JSONP.method('bequeath', function(){
		var target = this.script.target;
		this.script.once('readystatechange', function(){
			if(/loaded|complete/.test(target.readyState)){
				this.onResponse({ type:'load' });
			}
		});
	});

	return JSONP;
});