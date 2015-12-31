define([
	'../utils/Map',
	'../utils/Scope',
	'../utils/Class',
	'../utils/Promise',
	'../events/EventProxy'
], function(Map, Scope, Class, Promise, EventProxy){

	var JSONP = new Class(function JSONP(url, callbackId){
		var hasCallbackId = Type.isString(callbackId) && callbackId.length;
		callbackId = hasCallbackId? callbackId:'JSONP._'+(JSONP.calls++).toString(36);
		Class.proxyfy(this, 'onResponse', 'onResult');
		this.msie = document.documentMode;
		this.uri = Scope.pathArray(callbackId);
		this.namespace = this.uri.shift();
		this.callbackUri = this.uri.join('.');
		this.instance = window[this.namespace] = window[this.namespace] || Class.create(null);
		this.callback = Scope.register(this.instance);
		this.callback(this.callbackUri, this.onResult);
		this.promise = new Promise();
		this.script = new EventProxy(document.createElement('script'));
		this.script.once('load', this.onResponse);
		this.script.once('error', this.onResponse);
		this.msie <= 8 && this.promise.then(this.bequeath);
		this.script.target.type = 'text/javascript';
		this.script.target.async = true;
		this.script.target.src = String(url).replace('JSON_CALLBACK', callbackId);
		document.body.appendChild(this.script.target);
		return this.promise;
	}).static('calls', 0);
	
	JSONP.method('bequeath', function(){
		var target = this.script.target;
		this.script.once('readystatechange', Class.proxy(function(){
			if(/loaded|complete/.test(target.readyState)){
				this.onResponse({ type:'load' });
			}
		}, this));
	});

	JSONP.method('abort', function(){
		this.script && this.script.target && this.onResponse(undefined);
	});

	JSONP.method('onResponse', function(event){
		document.body.removeChild(this.script.target);
		delete(this.script.target);
		delete(this.script);
		var value = { info:null, headers:null, statusText:'', status:-1 };
		var callback = this.callback(this.callbackUri);
		if(event){
			if(event.type === 'load' && !callback.called){
				event = { type:'error' };
			}
			value.statusText = event.type || '';
			value.status = event.type === 'error'? 404:200;
		}else{
			this.promise.reject(value);
			return void(0);
		}
		if(status === 0){
			// status = response? 200:urlResolve(url).protocol == 'file'? 404:0;
		}
		value.status = value.status === 1223? 204:value.status;
		value.info = callback.response;
		this.promise.resolve(value);
		window.setTimeout(Class.proxy(this.flush, this), 1);
	});

	JSONP.method('onResult', function(response){
		this.callback(this.callbackUri+'.response', response);
		this.callback(this.callbackUri+'.called', true);
	});

	return JSONP;
});