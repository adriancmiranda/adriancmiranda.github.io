/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Promise = scope.uri('Promise');
	var HttpData = scope.uri('HttpData');

	// JSONP implementation
	// @support IE8+ fallback
	// @see N/A yet.
	var JsonPadding = new Proto(function JsonPadding(url){
		Proto.rebind(this, 'onResponse', 'onResult');
		if(url){return this.load(url);}
	}).static('calls', 0);

	JsonPadding.public('load', function(url){
		this.callbackId = '$'+(JsonPadding.calls++).toString(36);
		this.namespace = scope.namespace + '.JsonPadding.' + this.callbackId;
		this.url = String(url).replace('JSON_CALLBACK', this.namespace);
		JsonPadding[this.callbackId] = this.onResult;
		this.script = document.createElement('script');
		this.script.addEventListener('load', this.onResponse);
		this.script.addEventListener('error', this.onResponse);
		this.script.type = 'text/javascript';
		this.script.async = true;
		this.script.src = this.url;
		this.promise = new Promise();
		document.body.appendChild(this.script);
		return this.promise;
	});

	JsonPadding.public('abort', function(){
		this.script && this.onResponse(undefined);
	});

	JsonPadding.public('onResponse', function(evt){
		var data, callback = JsonPadding[this.callbackId];
		evt = evt || { type:'unknown' };
		evt.type = evt.type === 'load' && !callback.called? 'error' : evt.type;
		evt.status = evt.type === 'error'? 404 : 200;
		data = new HttpData(callback.response, null, evt.status, evt.type, this.url);
		this.promise[evt.type === 'error'? 'reject' : 'resolve'](data);
		this.script.removeEventListener('error', this.onResponse);
		this.script.removeEventListener('load', this.onResponse);
		document.body.removeChild(this.script);
		delete(JsonPadding[this.callbackId].response);
		delete(JsonPadding[this.callbackId].called);
		delete(JsonPadding[this.callbackId]);
		this.flush();
	});

	JsonPadding.public('onResult', function(response){
		JsonPadding[this.callbackId].response = response;
		JsonPadding[this.callbackId].called = true;
	});

	scope.uri('JsonPadding', JsonPadding);

}).call(this, Ambox);