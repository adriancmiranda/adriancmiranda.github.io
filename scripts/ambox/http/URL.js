/* global Ambox */
(function(Ambox){
	var patterns = Ambox.namespace('patterns');
	var Proto = Ambox.namespace('Proto');

	// URL normalize
	// @role IE8 and IE9 fallback to `window.URL` Native
	// @see https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
	// @see http://caniuse.com/#search=URL
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var URL = new Proto(function URL(value){
		if(value instanceof URL){return value;}
		URL.anchor.setAttribute('href', URL.normalize(value));
		var queryString = {};
		this.pathname = (URL.anchor.pathname.charAt(0) === '/')? URL.anchor.pathname:'/'+ URL.anchor.pathname;
		this.protocol = URL.anchor.protocol? URL.anchor.protocol.replace(patterns.endsWith(':'), '') : '';
		this.search = URL.anchor.search? URL.anchor.search.replace(patterns.startWith('?'), '') : '';
		this.hash = URL.anchor.hash? URL.anchor.hash.replace(patterns.startWith('#'), '') : '';
		this.password = URL.anchor.password;
		this.username = URL.anchor.username;
		this.hostname = URL.anchor.hostname;
		this.origin = URL.anchor.origin;
		this.port = URL.anchor.port;
		this.host = URL.anchor.host;
		this.href = URL.anchor.href;
		this.params = queryString;
		// Thank's to Steven Benner
		// @see http://bit.ly/1yY7EJf
		this.search.replace(patterns.queryString, function($0, $1, $2, $3){
			queryString[$1] = $3;
		});
	}).static('anchor', document.createElement('a')).static('normalize', function(value){
		if(document.documentMode){
			URL.anchor.setAttribute('href', value);
			value = URL.anchor.href;
		}
		return value;
	});

	Ambox.namespace('URL', URL);

}).call(this, Ambox);