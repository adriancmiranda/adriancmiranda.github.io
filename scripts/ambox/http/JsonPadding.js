/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');
	var Promise = scope.uri('Promise');
	var HttpEvent = scope.uri('HttpEvent');

	// JSONP
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var JsonPadding = new Proto(function JsonPadding(){
		Proto.rebind(this, 'onResponse', 'onResult');
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
		this.defer = new Promise();
		document.body.appendChild(this.script);
		return this.defer;
	});

	JsonPadding.public('abort', function(){
		JsonPadding.ABORTED = true;
		this.script && this.onResponse(undefined);
		delete(JsonPadding.ABORTED);
	});

	JsonPadding.public('onResponse', function(evt){
		var event, callback = JsonPadding[this.callbackId];
		evt = evt || Proto.create(null);
		evt.type = evt.type === 'load' && !callback.called? 'error' : evt.type;
		evt.status = evt.type === 'error'? 404 : JsonPadding.ABORTED? -1 : 200;
		event = new HttpEvent(callback.response, null, evt.status, evt.type, this.url);
		this.defer[/^(error|)$/.test(evt.type)? 'reject' : 'resolve'](event);
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