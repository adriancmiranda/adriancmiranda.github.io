require.config({
	waitSeconds:10,
	baseUrl:'scripts',
	paths:{
		'library': 'am/library/',
		'portifa': 'am/portifa/',
		'scope': 'am/scope'
	},
	deps:[
		'portifa/main'
	]
});
