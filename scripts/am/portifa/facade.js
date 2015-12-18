define([
	'scope',
	'library/display/Element',
	'library/geom/Point',
	'library/geom/Triangle',
	'library/geom/Rectangle',
	'library/utils/Class',
	'library/utils/Ticker'
], function(scope, Element, Point, Triangle, Rectangle, Class, Ticker){

	var Facade = new Class(function(canvas, options){
		this.options = Class.options({}, this.defaults, options);
		this.canvas = new Element(canvas);
		this.ticker = new Ticker(this.options.FPS, this.options.autoStartRender);
		this.ticker.add(this.render, this);
	}).method('defaults', {
		autoStartRender: false,
		FPS: 60
	});

	Facade.method('initialize', function(){
	});

	Facade.method('startRender', function(){
		this.ticker.start();
	});

	Facade.method('stopRender', function(){
		this.ticker.stop();
	});

	Facade.method('render', function(){
		console.log('rendering...', this.ticker.getFPS());
	});

	return Facade;
});