define([
	'scope',
	'library/net/XHR',
	'library/net/JSONP',
	'library/utils/Class'
], function(scope, XHR, JSONP, Class){

	var Facade = new Class(function(canvas, options){
		this.options = Class.options({}, this.constructor.defaults, options);
	}).static('defaults', {
		autoStartRender: false,
		FPS: 60
	});

	Facade.method('urls', [
		{ url:'http://www.mocky.io/v2/56827be21000004706153882?anything=JSON_CALLBACK' },
		{ url:'http://www.mockapi.net/api/4iHXpbqytyicDwR3R?callback=JSON_CALLBACK' },
		{ url:'http://www.reddit.com/.json?limit=1&jsonp=JSON_CALLBACK' },
		{ url:'http://www.mocky.io/v2/5680b2b4100000b13737317c' },
		{ url:'https://api.parse.com/1/classes/Message' }
	]);

	Facade.method('startRender', function(){
		// this.JSONP([this.urls[0].url, this.urls[2].url]);
		this.XHR(this.urls[4].url);
	});

	Facade.method('JSONP', function(urls){
		return new JSONP().load(this.urls[0].url, 'am.callbacks._0').then(new JSONP().load(this.urls[2].url));
	});

	Facade.method('XHR', function(url){
		// http://blog.parse.com/learn/engineering/javascript-and-user-authentication-for-the-rest-api/
		XHR.defaults.headers.common['X-Parse-Application-Id'] = scope.config.parse.appId;
		XHR.defaults.headers.common['X-Parse-REST-API-Key'] = scope.config.parse.restKey;
		var xhr = new XHR({
			url:url,
			method:'POST',
			data:{ message: "Hello world!" }
		}).then(function(value){
			console.log('value:', value);
		}).catch(function(reason){
			console.warn('reason:', reason);
		});
	});

	return Facade;
});