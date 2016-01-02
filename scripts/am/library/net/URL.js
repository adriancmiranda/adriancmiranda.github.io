define([
	'../utils/Class',
	'../common/patterns'
], function(Class, patterns){

	var URL = new Class(function URL(value){
		this.value = value = URL.isValid(value)? value:location.href.replace(/%27/g,"'");
		URL.a.setAttribute('href', value);
		value = document.documentMode? URL.a.href:value;
		this.pathname = (URL.a.pathname.charAt(0) === '/')? URL.a.pathname:'/'+ URL.a.pathname;
		this.protocol = URL.a.protocol? URL.a.protocol.replace(patterns.endsWith(':'), ''):'';
		this.search = URL.a.search? URL.a.search.replace(patterns.startWith('?'), ''):'';
		this.hash = URL.a.hash? URL.a.hash.replace(patterns.startWith('#'), ''):'';
		this.hostname = URL.a.hostname;
		this.port = URL.a.port;
		this.host = URL.a.host;
		this.href = URL.a.href;
	}).static('a', document.createElement('a')).static('isValid', function(url){
		// Thank's to John Gruber @see: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
		return /\b((?:[a-z][\w-]+\:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi.test(url);
	});

	return URL;
});