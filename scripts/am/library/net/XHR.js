define([
	'./URL',
	'./HttpData',
	'../utils/Map',
	'../utils/Type',
	'../utils/Class',
	'../utils/Promise',
	'../common/patterns',
	'../events/EventProxy'
], function(URL, HttpData, Map, Type, Class, Promise, patterns, EventProxy){

	var XHR = new Class(function XHR(){
		Class.proxyfy(this, 'onLoad', 'onAbort', 'onError');
		this.client = new EventProxy(new window.XMLHttpRequest());
		this.client.once('load', this.onLoad);
		this.client.once('abort', this.onError);
		this.client.once('error', this.onAbort);
		if(arguments.length){
			return this.request.apply(this, arguments) || this;
		}
	});

	XHR.defaults = {
		headers:{
			common:{Accept:'application/json, text/plain, */*'},
			patch:{'Content-Type':'application/json;charset=utf-8'},
			post:{'Content-Type':'application/json;charset=utf-8'},
			put:{'Content-Type':'application/json;charset=utf-8'}
		},
		options:{
			transformResponse:[HttpData.defaultHttpResponseTransform],
			transformRequest:[HttpData.defaultHttpRequestTransform],
			xsrfHeaderName:'X-XSRF-TOKEN',
			xsrfCookieName:'XSRF-TOKEN',
			withCredentials:false,
			responseType:'json',
			method:'POST',
			url:new URL(),
			timeout:0,
			async:true,
			data:null,
		}
	};

	XHR.parseHeaders = function(headers){
		var parsed = Class.create(null);
		function append(header, value){
			parsed[header] = parsed[header]? (parsed[header] +', '+ value):value;
		}
		if(Type.isString(headers)){
			Map.array(headers.split('\n'), function(line, index, header){
				index = line.indexOf(':');
				header = String(line.substr(0, index)).toLowerCase().trim();
				header && append(header, line.substr(index + 1).trim());
			});
		}else if(Type.isObject(headers)){
			Map.object(headers, function(value, header){
				header = String(header).toLowerCase().trim();
				header && append(header, value.trim());
			});
		}
		return parsed;
	};

	XHR.toggleContentType = function(data, headers){
		if(Type.isUndefined(data)){
			Map.object(headers, function(value, header){
				if(String(header).toLowerCase() === 'content-type'){
					delete(headers[header]);
				}
			});
		}
		return headers;
	};

	XHR.headersGetter = function(headers){
		var headersObj;
		return function(name){
			if(!headersObj){
				headersObj = XHR.parseHeaders(headers);
			}
			if(name){
				var value = headersObj[String(name).toLowerCase()];
				if(value === void(0)){
					value = null;
				}
				return value;
			}
			return headersObj;
		};
	};

	XHR.executeHeaders = function(headers, options){
		var headerContent, processedHeaders = {};
		Map.object(headers, function(headerFn, header){
			if(Type.isFunction(headerFn)){
				headerContent = headerFn(options);
				if(headerContent != null){
					processedHeaders[header] = headerContent;
				}
			}else{
				processedHeaders[header] = headerFn;
			}
		});
		return processedHeaders;
	};

	XHR.mergeHeaders = function(options){
		var defHeaders = XHR.defaults.headers;
		var reqHeaders = Class.options({}, options.headers);
		var defHeaderName, lowercaseDefHeaderName, reqHeaderName;
		defHeaders = Class.options({}, defHeaders.common, defHeaders[String(options.method).toLowerCase()]);
		for(defHeaderName in defHeaders){
			lowercaseDefHeaderName = String(defHeaderName).toLowerCase();
			for(reqHeaderName in reqHeaders){
				if(String(reqHeaderName).toLowerCase() === lowercaseDefHeaderName){
					continue;
				}
			}
			reqHeaders[defHeaderName] = defHeaders[defHeaderName];
		}
		return XHR.executeHeaders(reqHeaders, Class.options({}, options));
	};

	XHR.define('responseType', {
		set:function(value){
			if(value){
				try{
					this.client.target.responseType = value;
				}catch(error){
					if(value !== 'json'){
						throw error;
					}
				}
			}
		},
		get:function(){
			return this.client.target.responseType;
		}
	});

	XHR.define('withCredentials', {
		set:function(value){
			value = Type.toBoolean(value);
			if(value){
				this.client.target.withCredentials = value;
			}
		},
		get:function(){
			return this.client.target.withCredentials;
		}
	});

	XHR.define('timeout', {
		set:function(milliseconds){
			this.client.target.timeout = Type.toUint(milliseconds);
		},
		get:function(){
			return this.client.target.timeout;
		}
	});

	XHR.define('upload', {
		get:function(){
			return this.client.target.upload;
		}
	});

	XHR.define('responseXML', {
		get:function(){
			return this.client.target.responseXML;
		}
	});

	XHR.define('response', {
		get:function(){
			return this.client.target.response;
		}
	});

	XHR.define('responseText', {
		get:function(){
			return this.client.target.responseText;
		}
	});

	XHR.define('readyState', {
		get:function(){
			return this.client.target.readyState;
		}
	});

	XHR.define('status', {
		get:function(){
			return this.client.target.status;
		}
	});

	XHR.define('statusText', {
		get:function(){
			return this.client.target.statusText;
		}
	});

	XHR.charge('setRequestHeader', function(headers){
		Map.object(headers, function(value, header){
			this.setRequestHeader(header, value);
		}, this);
	});

	XHR.charge('setRequestHeader', function(header, value){
		if(Type.isString(header) && Type.isString(value)){
			this.client.target.setRequestHeader(header.trim(), value.trim());
		}
	});

	XHR.method('getAllResponseHeaders', function(){
		return this.client.target.getAllResponseHeaders();
	});

	XHR.method('getResponseHeader', function(header){
		return this.client.target.getResponseHeader(header);
	});

	XHR.method('overrideMimeType', function(mimetype){
		this.client.target.overrideMimeType(mimetype);
	});

	XHR.method('open', function(method, url, async, user, password){
		this.client.target.open(method, url, async, user, password);
	});

	XHR.method('abort', function(){
		this.client.target.abort();
	});

	XHR.method('send', function(payload){
		this.client.target.send(Type.isDefined(payload)? payload:null);
	});

	XHR.charge('request', function(options){
		return Type.isObjectLike(options) &&
		this.request(options, options.headers);
	});

	XHR.charge('request', function(options, headers){
		headers = headers || {};
		return Type.isObjectLike(options) &&
		Type.isObjectLike(headers) &&
		this.request(options.url, options, headers);
	});

	XHR.charge('request', function(url, options, headers){
		return Type.isString(url) &&
		Type.isObjectLike(options) &&
		Type.isObjectLike(headers) &&
		this.request(url, options.data, options, headers);
	});

	XHR.charge('request', function(url, data, options, headers){
		options = Class.options({}, XHR.defaults.options, headers, options, { url:new URL(url) });
		headers = XHR.toggleContentType(data, XHR.mergeHeaders(options));
		data = new HttpData(data, XHR.headersGetter(headers), this.status, this.statusText, options);
		this.options = options;
		this.defer = new Promise();
		this.client = new EventProxy(new window.XMLHttpRequest());
		this.open(options.method, url, options.async);
		this.setRequestHeader(headers);
		this.client.once('load', this.onLoad);
		this.client.once('abort', this.onError);
		this.client.once('error', this.onAbort);
		this.withCredentials = options.withCredentials;
		this.responseType = options.responseType;
		this.send(data.transform(options.transformRequest));
		return this.defer;
	});

	XHR.method('onLoad', function(){
		var target = this.client.target;
		var data = 'response' in target? target.response:target.responseText;
		var headers = target.getAllResponseHeaders();
		var response = new HttpData(data, headers, target.status, target.statusText, this.options);
		response.data = response.transform(this.options.transformResponse);
		if(200 <= response.status && response.status < 300){
			this.onload && this.onload(response.toObject());
			this.defer.resolve(response.toObject());
		}else{
			this.onerror && this.onerror(response.toObject());
			this.defer.reject(response.toObject());
		}
	});

	XHR.method('onError', function(){
		var reason = new HttpData(null, null, -1, '');
		this.onerror && this.onerror(response.toObject());
		this.defer.reject(reason.toObject());
	});

	XHR.method('onAbort', function(){
		var reason = new HttpData(null, null, -1, '');
		this.onabort && this.onabort(response.toObject());
		this.defer.reject(reason.toObject());
	});

	return XHR;
});