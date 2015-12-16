define([
	'../utils/Map',
	'../utils/Type',
	'../utils/Promise'
], function(Map, Type, Promise){
	'use strict';
	
	var HttpRequest = new Class(function HttpRequest(){
		// N/A yet.
	});

	HttpRequest.method('createXHR', function(method, url){
		if(window.XMLHttpRequest){
			return new window.XMLHttpRequest();
		}else if(window.ActiveXObject){
			try{
				return new window.ActiveXObject('Msxml2.XMLHTTP');
			}catch(error){
				return new window.ActiveXObject('Microsoft.XMLHTTP');
			}
		}
		return void 0;
	});

	HttpRequest.charge('jsonpRequest', function(url, callbackId, done){
	});

	HttpRequest.charge('request', function(method, url, post, callback, headers, timeout, withCredentials, responseType){
		if(lowercase(method) === 'jsonp'){
			// N/A yet.
		}else{
			var xhr = this.createXHR(method, url);
			xhr.open(method, url, true);

			Map.object(headers, function(value, key){
				if(Type.isDefined(value)){
					xhr.setRequestHeader(key, value);
				}
			}, this, false);
			
			xhr.onload = function requestLoaded(){
				var statusText = xhr.statusText || '';
				var response = 'response' in xhr ? xhr.response : xhr.responseText;
				var status = xhr.status === 1223 ? 204 : xhr.status;
				if(status === 0){
					status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;// XXX
				}
				completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText);
			};

			xhr.onerror = xhr.onerror = function requestError(){
				// N/A yet.
			};

			if(withCredentials){
				xhr.withCredentials = true;
			}

			if(responseType){
				try{
					xhr.responseType = responseType;
				}catch(erro){
					if(responseType !== 'json'){
						throw erro;
					}
				}
			}

			xhr.send(Type.isUndefined(post) ? null : post);
		}
	});

	HttpRequest.charge('request', function(method, url, data, headers){
	});

	return HttpRequest;
});
