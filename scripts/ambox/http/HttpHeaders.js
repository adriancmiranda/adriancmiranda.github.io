/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var iterate = scope.uri('iterate');

	// HttpHeaders
	// @support IE9+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest (wrong for IE9 actually)
	var HttpHeaders = new Proto(function HttpHeaders(headers, method, data, params){
		this.value = Proto.merge({}, headers);
		this.method = Type.isString(method)? method.toLowerCase() : '';
		this.defaults = Proto.merge({}, HttpHeaders.defaults.common, HttpHeaders.defaults[this.method]);
		this.value = toggleContentType(data, mergeHeaders(this.value, this.method, params));
		this.fn = headersGetter(this.value);
	}).static('defaults', {
		common:{Accept:'application/json, text/plain, */*'},
		patch:{'Content-Type':'application/json;charset=utf-8'},
		post:{'Content-Type':'application/json;charset=utf-8'},
		put:{'Content-Type':'application/json;charset=utf-8'}
	});

	function parseHeaders(headers){
		var parsed = Proto.create(null);
		function append(header, value){
			parsed[header] = parsed[header]? (parsed[header] +', '+ value):value;
		}
		if(Type.isString(headers)){
			iterate.index(headers.split('\n'), function(line, index, header){
				index = line.indexOf(':');
				header = String(line.substr(0, index)).toLowerCase().trim();
				header && append(header, line.substr(index + 1).trim());
			});
		}else if(Type.isObject(headers)){
			iterate.property(headers, function(value, header){
				header = String(header).toLowerCase().trim();
				header && append(header, value.trim());
			});
		}
		return parsed;
	};

	function headersGetter(headers){
		var headersObj;
		return function(name){
			if(!headersObj){
				headersObj = parseHeaders(headers);
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
	}

	function executeHeaderFunctions(headers, params){
		var headerContent, processedHeaders = {};
		iterate.property(headers, function(headerFn, header){
			if(Type.isFunction(headerFn)){
				headerContent = headerFn(params);
				if(headerContent != null){
					processedHeaders[header] = headerContent;
				}
			}else{
				processedHeaders[header] = headerFn;
			}
		});
		return processedHeaders;
	}

	function mergeHeaders(headers, method, params){
		headers = Proto.merge({}, headers);
		var defaults = Proto.merge({}, HttpHeaders.defaults.common, HttpHeaders.defaults[String(method).toLowerCase()]);
		defaultHeadersIteration:
		for(var defaultName in defaults){
			var defaultNameLower = String(defaultName).toLowerCase();
			for(var headerName in headers){
				if(String(headerName).toLowerCase() === defaultNameLower){
					continue defaultHeadersIteration;
				}
			}
			headers[defaultName] = defaults[defaultName];
		}
		return executeHeaderFunctions(headers, Proto.merge({}, params));
	}

	function toggleContentType(data, headers){
		if(Type.isUndefined(data)){
			iterate.property(headers, function(value, header){
				if(String(header).toLowerCase() === 'content-type'){
					delete(headers[header]);
				}
			});
		}
		return headers;
	}

	scope.uri('HttpHeaders', HttpHeaders);

}).call(this, Ambox);