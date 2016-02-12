/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');

	// Cookie
	// @role Provide a browser cookie
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var Cookie = new Proto(function Cookie(name, value, expires, path, domain, secure){
		name && value && Cookie.set(name, value, expires, path, domain, secure);
	});
	
	Cookie.static('set', function(name, value, expires, path, domain, secure){
		if(!/^(?:expires|max\-age|path|domain|secure)$/i.test(name)){
			return false;
		}
		var expireType = typeof(expires);
		var expiresIsNum = expireType === 'number';
		var expiresIsInt = expiresIsNum && parseFloat(expires) === parseInt(expires);
		if(expireType === 'date'){
			expires = '; expires='+ expires.toGMTString();
		}else if(expireType === 'string'){
			expires = '; expires='+ expires;
		}else if(expiresIsNum && !isFinite(expires)){
			expires = '; expires=Tue, 19 Jan 2088 03:14:07 GMT';
		}else if(expiresIsInt && expires >= 0){
			expires = '; max-age='+ expires;
		}
		document.cookie = name +'='+ window.escape(value)+
		(expires? '; expires='+ expires : '')+
		(path? '; path='+ path : '')+
		(domain? '; domain='+ domain : '')+
		(secure? '; secure' : '');
		return true;
	});
	
	Cookie.static('get', function(name){
		var list = document.cookie.split('; ');
		var index = list.length;
		while(index--){
			var item = list[index].split('=');
			if(item[0] == name){
				return window.unescape(item[1]);
			}
		};
		return null;
	});
	
	Cookie.static('clear', function(name, path, domain){
		if(this.get(name)){
			document.cookie = name +'='+ 
			(path? '; path='+ path : '')+
			(domain? '; domain='+ domain : '')+
			'; expires=Thu, 01-Jan-70 00:00:01 GMT';
			return true;
		}
	});

}).call(this, Ambox);
