define([
	'../utils/Map',
	'../utils/Class',
	'../utils/Promise'
], function(Map, Class, Promise){

	var XHR = new Class(function XHR(url, options, headers){
		var options;
		
		options = Class.options({}, this.constructor.defaults, options);
		options.headers = Class.options({}, options.headers, headers);
		options.headers.common = Class.options({}, options.headers.common);
		options.headers = Class.options({}, options.headers, options.headers.common);
		
		return new Promise(function(resolve, reject){
			
			var client = (function request(){
				try{return new window.XMLHttpRequest();}
				catch(error){}
				try{return new ActiveXObject('Msxml2.XMLHTTP');}
				catch(error){}
				try{return new ActiveXObject('Msxml2.XMLHTTP.6.0');}
				catch(error){}
				try{return new ActiveXObject('Msxml2.XMLHTTP.3.0');}
				catch(error){}
				try{ return new ActiveXObject('Microsoft.XMLHTTP');}
				catch(error){}
				throw new Error('This browser does not support XMLHttpRequest.');
			}());

			client.open(options.method, url);

			Map.object(options.headers, function(value, header){
				if(Type.isDefined(value)){
					client.setRequestHeader(header, value);
				}
			});

			client.onload = resolve;
			client.onerror = reject;
			client.onabort = reject;
		});
	});

	XHR.static('defaults', {
		withCredentials:false,
		responseType:'json',
		method:'POST',
		timeout:0,
		headers:{},
		data:{}
	});

	XHR.define('responseType', {
		set:function(value){
			if(value){
				try{
					this.client.responseType = value;
				}catch(error){
					if(responseType !== 'json'){
						throw error;
					}
				}
			}
		},
		get:function(){
			return this.client.responseType;
		}
	});

	XHR.define('withCredentials', {
		set:function(value){
			if(value){
				this.client.withCredentials = value;
			}
		},
		set:function(){
			return this.client.withCredentials;
		}
	});

	XHR.charge('setRequestHeader', function(header){
		Map.object(headers, function(value, header){
			if(Type.isDefined(value)){
				this.setRequestHeader(header, value);
			}
		}, this);
	});

	XHR.charge('setRequestHeader', function(header, value){
		this.client.setRequestHeader(header, value);
	});

	XHR.method('open', function(method, url){
		this.client.open(method, url);
	});

	XHR.method('send', function(body){
		this.client.send(body);
	});

	XHR.method('request', function(){
		// this.open(this.options.);
	});

	if(/^jsonp$/.test(String(method))){
		var jsonp = new Promise(function (resolve, reject){
			var jsonp = new JSONP(url, callbackId);
			jsonp.on('load', resolve);
			jsonp.on('error', reject);
			jsonp.load();
		});
	}else{
		var xhr = new Promise(function (resolve, reject)){
			var xhr = new XHR();
			xhr.open('POST', 'http://www.mocky.io/v2/5680b2b4100000b13737317c', false);
			xhr.setRequestHeader({});
			xhr.on('readystatechange', this.onReady);
			xhr.on('load', resolve);
			xhr.on('error', reject);
			xhr.on('abort', reject);
			xhr.withCredentials = true;
			xhr.responseType = 'json';
			xhr.send(post);
		});
	}

	return XHR;
});
