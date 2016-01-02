define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Class'
], function(Map, Type, Class){

	var XHRHeaders = new Class(function XHRHeaders(headers, params){
		return XHRHeaders.proxy(XHRHeaders.setContentType(params.data, XHRHeaders.applyDefaults(headers, params)));
	});

	XHRHeaders.static('defaults', {
		common:{Accept:'application/json, text/plain, */*'},
		patch:{'Content-Type':'application/json;charset=utf-8'},
		post:{'Content-Type':'application/json;charset=utf-8'},
		put:{'Content-Type':'application/json;charset=utf-8'}
	});

	XHRHeaders.static('setContentType', function(data, headers){
		if(Type.isUndefined(data)){
			Map.object(headers, function(value, header){
				if(String(header).toLowerCase() === 'content-type'){
					delete(headers[header]);
				}
			});
		}
		return headers;
	});

	XHRHeaders.static('applyDefaults', function(headers, params){
		var defHeaderName, lowercaseDefHeaderName, reqHeaderName;
		var defHeaders = XHRHeaders.defaults;
		var reqHeaders = Class.options({}, headers);
		defHeaders = Class.options({}, defHeaders.common, defHeaders[String(params.method).toLowerCase()]);
		for(defHeaderName in defHeaders){
			lowercaseDefHeaderName = String(defHeaderName).toLowerCase();
			for(reqHeaderName in reqHeaders){
				if(String(reqHeaderName).toLowerCase() === lowercaseDefHeaderName){
					continue;
				}
			}
			reqHeaders[defHeaderName] = defHeaders[defHeaderName];
		}
		XHRHeaders.executeHeaders(reqHeaders, Class.options({}, params));
	});

	XHRHeaders.static('executeHeaders', function(headers, options){
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
	});

	XHRHeaders.static('proxy', function(value){
		var headers = null;
		return function(name){
			if(headers === null){
				headers = XHRHeaders.toObject(value);
			}
			if(Type.isString(name)){
				value = headers[name.toLowerCase()];
				if(value === void(0)){
					value = null;
				}
				return value;
			}
			return headers;
		};
	});

	XHRHeaders.static('toObject', function(value){
		var headers = Class.create(null);
		function append(header, value){
			headers[header] = headers[header]? (headers[header] +', '+ value):value;
		}
		if(Type.isString(value)){
			Map.array(value.split('\n'), function(line, index, header){
				index = line.indexOf(':');
				header = String(line).substr(0, index).toLowerCase().trim();
				header && append(header, line.substr(index + 1).trim());
			});
		}else if(Type.isObjectLike(value)){
			Map.object(value, function(value, header){
				header = String(header).toLowerCase().trim();
				header && append(header, value.trim());
			});
		}
		return headers;
	});

	return XHRHeaders;
});