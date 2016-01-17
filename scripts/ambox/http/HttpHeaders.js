/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var iterate = scope.uri('iterate');

	// HttpHeaders
	// @support IE9+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest (wrong for IE9 actually)
	var HttpHeaders = new Proto(function HttpHeaders(headers, data, method, options){
		return HttpHeaders.setContentType(data, HttpHeaders.applyDefaults(headers, method, options));
	});

	HttpHeaders.static('defaults', {
		common:{Accept:'application/json, text/plain, */*'},
		patch:{'Content-Type':'application/json;charset=utf-8'},
		post:{'Content-Type':'application/json;charset=utf-8'},
		put:{'Content-Type':'application/json;charset=utf-8'}
	});

	HttpHeaders.static('setContentType', function(data, headers){
		if(Type.isUndefined(data)){
			iterate.property(headers, function(value, header){
				if(String(header).toLowerCase() === 'content-type'){
					delete(headers[header]);
				}
			});
		}
		return headers;
	});

	HttpHeaders.static('applyDefaults', function(headers, method, options){
		headers = Proto.merge({}, headers);
		method = String(method).toLowerCase();
		var defaults = Proto.merge({}, HttpHeaders.defaults.common, HttpHeaders.defaults[method]);
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
		return HttpHeaders.executeHeadersFunctions(headers, Proto.merge({}, options));
	});

	HttpHeaders.static('executeHeadersFunctions', function(headers, options){
		var headerContent, processedHeaders = {};
		iterate.property(headers, function(headerFn, header){
			if(Type.isFunction(headerFn)){
				headerContent = headerFn(options);
				if(!Type.isNull(headerContent)){
					processedHeaders[header] = headerContent;
				}
			}else{
				processedHeaders[header] = headerFn;
			}
		});
		return processedHeaders;
	});

	HttpHeaders.static('proxy', function(value){
		var headers;
		return function(name){
			if(Type.isUndefined(headers)){
				headers = HttpHeaders.toObject(value);
			}
			if(Type.isString(name)){
				value = headers[name.toLowerCase()];
				return value === void(0)? null : value;
			}
			return headers;
		};
	});

	HttpHeaders.static('toObject', function(value){
		var headers = Proto.create(null);
		function append(header, value){
			headers[header] = headers[header]? (headers[header] +', '+ value):value;
		}
		if(Type.isString(value)){
			iterate.index(value.split('\n'), function(line, index, header){
				index = line.indexOf(':');
				header = String(line).substr(0, index).toLowerCase().trim();
				header && append(header, line.substr(index + 1).trim());
			});
		}else if(Type.isObjectLike(value)){
			iterate.property(value, function(value, header){
				header = String(header).toLowerCase().trim();
				header && append(header, value.trim());
			});
		}
		return headers;
	});

	scope.uri('HttpHeaders', HttpHeaders);

}).call(this, Ambox);