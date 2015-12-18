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
		this.context = this.canvas.node.getContext('2d');
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

	Facade.method('drawRectangle', function(){
		var SW = this.canvas.width();
		var SH = this.canvas.height();
		var lineWidth = 0.5;

		var size = new Point(8, 8);
		var rect = new Rectangle(SW-(size.x+lineWidth), SH-(size.y+lineWidth), size.x, size.y);
		this.context.beginPath();
		this.context.moveTo(rect.left, rect.top);
		this.context.lineTo(rect.right, rect.top);
		this.context.lineTo(rect.right, rect.bottom);
		this.context.lineTo(rect.left, rect.bottom);
		this.context.lineTo(rect.left, rect.top-(lineWidth/2));
		this.context.closePath();
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = '#000';
		this.context.stroke();
		
		var thickness = 1.5;
		this.context.beginPath();
		this.context.fillStyle = '#FF0000';
		this.context.fillRect(rect.centroid.x - thickness / 2, rect.centroid.y - thickness / 2, thickness, thickness);
		this.context.fill();
	});

	Facade.method('drawTriangle', function(){
		var SW = this.canvas.width();
		var SH = this.canvas.height();
		var lineWidth = 0.5;
		var triangle = new Triangle(new Point((SW/2), 10), new Point((SW/2)-100, 400), new Point(100, 100));
		this.context.beginPath();
		this.context.moveTo(triangle.a.x, triangle.a.y);
		this.context.lineTo(triangle.b.x, triangle.b.y);
		this.context.lineTo(triangle.c.x, triangle.c.y);
		this.context.lineTo(triangle.a.x, triangle.a.y);
		this.context.closePath();
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = '#cc00ff';
		this.context.stroke();
		// ================================
		this.context.beginPath();
		this.context.fillStyle = '#FF0000';
		this.context.arc(triangle.centroid.x, triangle.centroid.y, 3, 0, 2*Math.PI, false);
		this.context.fill();
		// ================================
		var bounds = triangle.getBoundsRect();
		this.context.beginPath();
		this.context.strokeStyle = '#00CCFF';
		this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
		this.context.stroke();
		// ================================
		this.context.lineCap = 'round';
		this.context.lineJoin = 'round';
		this.context.lineWidth = lineWidth;
		this.context.beginPath();
		this.context.moveTo(triangle.a.x, triangle.a.y);
		this.context.lineTo(triangle.midpointCA.x, triangle.midpointCA.y);
		this.context.closePath();
		this.context.strokeStyle = '#000000';
		this.context.stroke();
		// --
		this.context.beginPath();
		this.context.moveTo(triangle.c.x, triangle.c.y);
		this.context.lineTo(triangle.midpointBC.x, triangle.midpointBC.y);
		this.context.closePath();
		this.context.strokeStyle = '#FF0000';
		this.context.stroke();
		// --
		this.context.beginPath();
		this.context.moveTo(triangle.b.x, triangle.b.y);
		this.context.lineTo(triangle.midpointAB.x, triangle.midpointAB.y);
		this.context.closePath();
		this.context.strokeStyle = '#00FF00';
		this.context.stroke();
		// ================================
		var p1 = new Point(2,4);
		var p2 = new Point(5,2);
	});

	Facade.method('render', function(){
		this.drawRectangle();
		this.drawTriangle();
	});

	return Facade;
});