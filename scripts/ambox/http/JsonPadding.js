/* global Ambox */
(function(Ambox){
	var Proto = Ambox.namespace('Proto');

	// JsonPadding implementation
	// @support IE8+ fallback
	// @see N/A yet.
	var JsonPadding = new Proto(function JsonPadding(){
	});

	JsonPadding.public('bequeath', function(){
		var target = this.script.target;
		this.script.once('readystatechange', Proto.proxy(function(){
			if(/loaded|complete/.test(target.readyState)){
				this.onResponse({ type:'load' });
			}
		}, this));
	});

	JsonPadding.public('open', function(){
	});

	JsonPadding.public('abort', function(){
	});

	Ambox.namespace('JsonPadding', JsonPadding);

}).call(this, Ambox);