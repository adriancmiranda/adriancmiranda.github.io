define([
	'../utils/Class',
	'../common/patterns'
], function(Class, patterns){

	var URL = new Class(function URL(value){
		URL.anchor.setAttribute('href', URL.normalize(value));
		this.pathname = (URL.anchor.pathname.charAt(0) === '/')? URL.anchor.pathname:'/'+ URL.anchor.pathname;
		this.protocol = URL.anchor.protocol? URL.anchor.protocol.replace(patterns.endsWith(':'), ''):'';
		this.search = URL.anchor.search? URL.anchor.search.replace(patterns.startWith('?'), ''):'';
		this.hash = URL.anchor.hash? URL.anchor.hash.replace(patterns.startWith('#'), ''):'';
		this.hostname = URL.anchor.hostname;
		this.port = URL.anchor.port;
		this.host = URL.anchor.host;
		this.href = URL.anchor.href;
	}).static('anchor', document.createElement('a')).static('normalize', function(value){
		if(document.documentMode){
			URL.anchor.setAttribute('href', value);
			value = URL.anchor.href;
		}
		return value;
	});

	return URL;
});