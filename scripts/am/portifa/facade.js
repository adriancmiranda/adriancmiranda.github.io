define([
	'scope',
	'library/utils/Class',
	'library/utils/Ticker',
	'library/utils/Promise',
	'library/display/DOMElement'
], function(scope, Class, Ticker, Promise, DOMElement){

	var Facade = new Class(function(canvas, options){
		this.options = Class.options({}, this.defaults, options);
		this.canvas = new DOMElement(canvas);
		this.context = this.canvas.node.getContext('2d');
		this.SW = this.canvas.width();
		this.SH = this.canvas.height();
		this.CW = this.SW * 0.5;
		this.CH = this.SH * 0.5;
		this.ticker = new Ticker(this.options.FPS, this.options.autoStartRender);
		this.ticker.add(this.render, this);
	}).method('defaults', {
		autoStartRender: false,
		FPS: 60
	});

	Facade.method('initialize', function(){
	});

	Facade.method('startRender', function(){
		new Promise(function(resolve, reject){
			setTimeout(function(){
				// resolve(this);
				resolve('sucesso');
			}.bind(this), 2000);
			// console.log(resolve, reject);
				// reject('erro');
		}).then(function(data){
			alert('data:'+ data);
		// 	this.ticker.start();
			// return data;
		}, function(reason){
			alert('rejected!!!! '+reason);
		});
	});

	Facade.method('stopRender', function(){
		this.ticker.stop();
	});

	Facade.method('render', function(){
		console.log('rendering....');
	});

	return Facade;
});