## Teorema de pitágoras:

	α = 0
	π = Math.PI
	Cálculo da hipotenusa:
		Math.sqrt((a * a) + (b * b));
		ou
		Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

	Cálculo dos catetos:
		a = Math.sqrt((hipotenusa * hipotenusa) - (b * b));
		b = Math.sqrt((hipotenusa * hipotenusa) - (a * a));
		ou
		a = Math.sqrt(Math.pow(hipotenusa, 2) - Math.pow(b, 2));
		b = Math.sqrt(Math.pow(hipotenusa, 2) - Math.pow(a, 2));


## URL Absoluta (e.g. http://google.com)

```javascript
var patterns = ({
	// Thank's to John Gruber for `isAbsoluteURL` @see: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
	isAbsoluteURL:/\b((?:[a-z][\w-]+\:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i
});
```

HttpEvent normalize
===================

XMLHttpRequest
```javascript
var data = 'response' in target? target.response:target.responseText;
var headers = target.getAllResponseHeaders();
var response = new HttpEvent(data, headers, target.status, target.statusText, this.options);
response.data = response.transform(this.options.transformResponse);
if(200 <= response.status && response.status < 300){
	this.onload && this.onload(response);
	this.defer.resolve(response);
}else{
	this.onerror && this.onerror(response);
	this.defer.reject(response);
}
```

JsonPadding
```javascript
var value = { info:null, headers:null, statusText:'', status:-1 };
var callback = this.callback(this.callbackUri);
if(event){
	if(event.type === 'load' && !callback.called){
		event = { type:'error' };
	}
	value.statusText = event.type || '';
	value.status = event.type === 'error'? 404:200;
}else{
	this.promise.reject(value);
	return void(0);
}
if(status === 0){
	status = response? 200:urlResolve(url).protocol == 'file'? 404:0;
}
value.status = value.status === 1223? 204:value.status;
value.info = callback.response;
```

Both
```javascript
if(status === 0){
	status = response? 200:urlResolve(url).protocol == 'file'? 404:0;
}
status === 1223? 204 : status
```