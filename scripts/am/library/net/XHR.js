define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Class',
	'../utils/Promise',
	'../events/EventProxy',
	'../events/EventEmitter'
], function(Map, Type, Class, Promise, EventProxy, EventEmitter){

	var XHR = new Class(function XHR(){
		if(this instanceof XHR){
			Class.proxyfy(this, 'onLoad', 'onError');
			this.super.constructor.call(this);
			this.client = new EventProxy(new window.XMLHttpRequest());
			if(arguments.length){
				return this.request.apply(this, arguments) || this;
			}
		}
		return new XHR();
	}).extends(EventEmitter);

	XHR.defaults = ({
		options:{
			xsrfCookieName:'XSRF-TOKEN',
			xsrfHeaderName:'X-XSRF-TOKEN',
			withCredentials:false,
			responseType:'json',
			method:'POST',
			timeout:0,
			async:true,
			data:undefined
		}
	});

	XHR.defaults.headers = ({
		patch:{'Content-Type':'application/json;charset=utf-8'},
		post:{'Content-Type':'application/json;charset=utf-8'},
		put:{'Content-Type':'application/json;charset=utf-8'}
	});

	XHR.defaults.headers.common = ({
		Accept:'application/json, text/plain, */*'
	});

	XHR.defaults.options.transformRequest = [function(data){
		if(Type.isFile(data) || Type.isBlob(data) || Type.isFormData(data)){
			return data;
		}
		return Type.toJSON(data);
	}];

	XHR.defaults.options.transformResponse = [function(data, headers){
		if(Type.isString(data)){
			var tempData = data.replace(patterns.jsonProtectionPrefix, '').trim();
			if(tempData){
				var contentType = headers('Content-Type');
				if((contentType && (contentType.indexOf('application/json') === 0)) || Type.isJSONLike(tempData)){
					data = Type.fromJSON(tempData);
				}
			}
		}
		return data;
	}];

	XHR.static('transformResponse', function(options, defer){
		return function(response){
			response = Class.options({}, response);
			response.data = XHR.transformData(response.data, response.headers, response.status, options.transformResponse);
			return 200 <= response.status && response.status < 300? response:defer.reject(response);
		};
	});

	XHR.static('transformData', function(data, headers, status, transform){
		if(Type.isFunction(transform)){
			return transform(data, headers, status);
		}
		Map.array(transform, function(fn){
			data = fn(data, headers, status);
		});
		return data;
	});

	XHR.static('parseHeaders', function(headers){
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
	});

	XHR.static('toggleContentType', function(data, headers){
		if(Type.isUndefined(data)){
			Map.object(headers, function(value, header){
				if(String(header).toLowerCase() === 'content-type'){
					delete(headers[header]);
				}
			});
		}
		return headers;
	});

	XHR.static('headersGetter', function(headers){
		var headersObj;
		return function(name){
			if(!headersObj){
				headersObj = this.parseHeaders(headers);
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
	});

	XHR.static('executeHeaders', function(headers, options){
		var headerContent, processedHeaders = {};
		Map.object(headers, function(headerFn, header){
			if(Type.isFunction(headerFn)){
				headerContent = headerFn(config);
				if(headerContent != null){
					processedHeaders[header] = headerContent;
				}
			}else{
				processedHeaders[header] = headerFn;
			}
		});
		return processedHeaders;
	});

	XHR.static('mergeHeaders', function(options){
		var defHeaders = this.defaults.headers;
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
		return this.executeHeaders(reqHeaders, Class.options({}, options));
	});

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
			if(value){
				this.client.target.withCredentials = value;
			}
		},
		set:function(){
			return this.client.target.withCredentials;
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

	XHR.method('open', function(method, url, async){
		this.client.target.open(method, url, async);
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
		options = Class.options({}, XHR.defaults.options, headers, options);
		headers = XHR.toggleContentType(data, XHR.mergeHeaders(options));
		data = XHR.transformData(data, XHR.headersGetter(headers), undefined, options.transformRequest);
		console.log('URL:', url);
		console.log('OPTIONS:', options);
		console.log('HEADERS:', headers);
		console.log('DATA:', data);
		this.defer = new Promise();
		this.client = new EventProxy(new window.XMLHttpRequest());
		this.open(options.method, url, options.async);
		this.setRequestHeader(headers);
		this.client.on('load', this.onLoad);
		this.client.on('error', this.onError);
		this.client.on('abort', this.onError);
		this.withCredentials = options.withCredentials;
		this.responseType = options.responseType;
		this.send(data);
		options = XHR.transformResponse(options, this.defer);
		return this.defer.then(options, options);
	});

	XHR.method('onLoad', function(){
		var value = {};
		var target = this.client.target;
		value.response = ('response' in target)? target.response:target.responseText;
		value.responseHeaders = target.getAllResponseHeaders();
		value.statusText = target.statusText || '';
		value.status = target.status === 1223? 204:target.status;
		if(value.status === 0){
			// value.status = response? 200:urlResolve(url).protocol === 'file'? 404:0;
		}
		this.emit('load', value);
		this.defer.resolve(value);
	});

	XHR.method('onError', function(){
		var reason = { response:null, responseHeaders:null, statusText:'', status:-1 };
		this.emit('error', reason);
		this.defer.reject(reason);
	});

	return XHR;
});