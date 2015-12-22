require.config({
	waitSeconds:10,
	baseUrl:'scripts',
	paths:{
		'Parse': 'http://www.parsecdn.com/js/parse-latest',
		'library': 'am/library/',
		'portifa': 'am/portifa/',
		'scope': 'am/scope'
	},
	deps:[
		'portifa/main'
	]
});
