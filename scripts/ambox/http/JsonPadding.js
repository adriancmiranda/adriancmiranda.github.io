/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Promise = scope.uri('Promise');
	var HttpEvent = scope.uri('HttpEvent');

	// JSONP
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	// @see http://caniuse.com/#search=async
	var JsonPadding = new Proto(function JsonPadding(){
		Proto.rebind(this, 'abort', 'padding');
	}).static('calls', 0);

	JsonPadding.public('load', function(url){
		url = Type.isObjectLike(url)? url.url : url;
		this.head = document.getElementsByTagName('head')[0];
		this.callbackId = '$'+(JsonPadding.calls++).toString(36);
		this.namespace = scope.namespace + '.JsonPadding.' + this.callbackId;
		this.url = String(url).replace('JSON_CALLBACK', this.namespace);
		JsonPadding[this.callbackId] = this.padding;
		this.script = document.createElement('script');
		this.script.addEventListener('load', this.abort);
		this.script.addEventListener('error', this.abort);
		this.script.id = this.namespace.replace(/\./g, '_');
		this.script.type = 'text/javascript';
		this.script.async = true;
		this.script.src = this.url;
		this.defer = new Promise();
		this.head.appendChild(this.script);
		return this.defer;
	});

	JsonPadding.public('abort', function(){
		if(this.script) return false;
		var evt = arguments[0] || { type:'' };
		evt.type = evt.type === 'load' && !this.called? 'error' : evt.type;
		evt.status = evt.type === 'error'? 404 : evt.type === ''? -1 : 200;
		evt = new HttpEvent(this.response, null, evt.status, evt.type, this.url);
		this.defer[/^(error|)$/.test(evt.statusText)? 'reject' : 'resolve'](evt);
		this.script.removeEventListener('error', this.abort);
		this.script.removeEventListener('load', this.abort);
		this.head.removeChild(this.script);
		this.flush();
		return true;
	});

	JsonPadding.public('padding', function(response){
		delete(JsonPadding[this.callbackId]);
		this.response = response;
		this.called = true;
	});

	scope.uri('JsonPadding', JsonPadding);

}).call(this, Ambox);