/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');

	// HttpRequestBuilder
	// @support IE10+ fallback
	// @see http://caniuse.com/#search=XMLHttpRequest
	var HttpRequestBuilder = new Proto(function HttpRequestBuilder(request){
		this.msie = document.documentMode;
		this.request = request;
	});

	HttpRequestBuilder.public('registerRequest', function(method, request){
	});

	HttpRequestBuilder.public('createRequest', function(responseType){
		if(/^jsonp$/i.test(responseType)){
			return ;
		}
		var method = /^(get|post|head|put|delete|options)$/i;
		if(this.msie <= 8 && (!method.test(responseType) || !window.XMLHttpRequest)){
			return new window.ActiveXObject('Microsoft.XMLHTTP');
		}else if(window.XMLHttpRequest){
			return new window.XMLHttpRequest();
		}
		throw new Error('This browser does not support XMLHttpRequest.');
	})

	scope.uri('HttpRequestBuilder', HttpRequestBuilder);

}).call(this, Ambox);