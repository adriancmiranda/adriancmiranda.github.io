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
		this.ticker.start();
	});

	Facade.method('stopRender', function(){
		this.ticker.stop();
	});

	Facade.method('drawLine', function(pointA, pointB, strokeColor, lineWidth, lineDash){
		var originalLineWidth = this.context.lineWidth;
		this.context.lineWidth = lineWidth || 2;
		this.context.strokeStyle = strokeColor || '#999';
		this.context.setLineDash(lineDash||[]);
		this.context.beginPath();
		this.context.stroke();
		this.context.moveTo(pointA.x, pointA.y);
		this.context.lineTo(pointB.x, pointB.y + (this.context.lineWidth * 0.5));
		this.context.stroke();
		this.context.closePath();
		this.context.setLineDash([0]);
		this.context.lineWidth = originalLineWidth;
	});

	Facade.method('drawRect', function(rect, strokeColor, lineWidth, lineDash){
		var originalLineWidth = this.context.lineWidth;
		this.context.lineWidth = lineWidth || 0.3;
		this.context.strokeStyle = strokeColor || '#00CCFF';
		this.context.setLineDash(lineDash||[]);
		this.context.beginPath();
		this.context.stroke();
		this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
		this.context.stroke();
		this.context.closePath();
		this.context.setLineDash([]);
		this.context.lineWidth = originalLineWidth;
	});

	Facade.method('drawCircle', function(point, radius, strokeColor, lineWidth, lineDash){
		if(!isFinite(radius))return;
		var originalLineWidth = this.context.lineWidth;
		this.context.lineWidth = lineWidth || 0.3;
		this.context.strokeStyle = strokeColor || '#ff0000';
		this.context.setLineDash(lineDash||[]);
		this.context.beginPath();
		this.context.stroke();
		this.context.arc(point.x, point.y, radius, 0, Math.PI * 2, true);
		this.context.stroke();
		this.context.closePath();
		this.context.setLineDash([]);
		this.context.lineWidth = originalLineWidth;
	});

	Facade.method('drawTriangle', function(triangle){
		this.drawCircle(triangle.topLeft, 6, '#222', 2);
		this.drawCircle(triangle.topRight, 6, '#222', 2);
		this.drawCircle(triangle.bottomRight, 6, '#222', 2);
		this.drawCircle(triangle.bottomLeft, 6, '#222', 2);
		this.drawRect(triangle.boundsRect, '#00CCFF', 0.5, [5]);
		this.drawCircle(triangle.a, 3);
		this.drawCircle(triangle.b, 3);
		this.drawCircle(triangle.c, 3);
		this.drawLine(triangle.a, triangle.b);
		this.drawLine(triangle.b, triangle.c);
		this.drawLine(triangle.c, triangle.a);
		this.drawCircle(triangle.centroid, 4, 'green');
		this.drawCircle(triangle.midpointAB, 3);
		this.drawCircle(triangle.midpointBC, 3);
		this.drawCircle(triangle.midpointCA, 3);
		this.drawLine(triangle.centroid, triangle.midpointAB, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.midpointBC, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.midpointCA, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.a, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.b, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.c, '#999', 1, [5]);
		this.drawCircle(triangle.orthocenter, 4, 'green');
		this.drawLine(triangle.orthocenter, triangle.a, 'red', 1, [5]);
		this.drawLine(triangle.orthocenter, triangle.b, 'red', 1, [5]);
		this.drawLine(triangle.orthocenter, triangle.c, 'red', 1, [5]);
		// this.drawCircle(triangle.incenter, 3);
		// this.drawCircle(triangle.circuncenter, 3);
	});

	Facade.method('render', function(){
		this.context.setTransform(1,0, 0,1, this.CW, this.CH);
		this.context.clearRect(-this.CW, -this.CH, this.SW, this.SH);
		this.context.fillStyle = '#eee';
		this.context.fillRect(-this.CW, -this.CH, this.SW, this.SH);
		this.drawTriangle(new Triangle(new Point(50, -150), new Point(-150,150), new Point(150,150)));
	});

	return Facade;
});