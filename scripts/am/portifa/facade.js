define([
	'scope',
	'library/display/DOMElement',
	'library/geom/Point',
	'library/geom/Triangle',
	'library/geom/Rectangle',
	'library/utils/Class',
	'library/utils/Ticker'
], function(scope, DOMElement, Point, Triangle, Rectangle, Class, Ticker){

	var Facade = new Class(function(canvas, options){
		this.options = Class.options({}, this.defaults, options);
		this.canvas = new DOMElement(canvas);
		this.context = this.canvas.node.getContext('2d');
		this.SW = this.canvas.width();
		this.SH = this.canvas.height();
		this.CW = this.SW * 0.5;
		this.CH = this.SH * 0.5;
		this.ticker = new Ticker(this.options.FPS, this.options.autoStartRender);
		this.ticker.once(this.render, this);
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

	Facade.method('drawAngle', function(point, directionA, directionB, radius, strokeColor, lineWidth, lineDash){
		if(!isFinite(radius))return;
		directionB += Math.PI; // revers second direction
		var originalLineWidth = this.context.lineWidth;
		var sweepAngle = directionB - directionA; // angle between lines
		var startAngle = directionA; // angle to start the sweep of the arc
		if(Math.abs(sweepAngle) > Math.PI){ // if the angle us greater the 180
			sweepAngle = Math.PI * 2 - sweepAngle; // get the smaller angle
			startAngle = directionB; // and change the start angle
		}
		this.context.lineWidth = lineWidth || 0.3;
		this.context.strokeStyle = strokeColor || '#ff0000';
		this.context.setLineDash(lineDash||[]);
		this.context.beginPath();
		this.context.stroke();
		if(sweepAngle < 0){ // if the angle is sweeping anticlockwise
			this.context.arc(point.x, point.y, radius, startAngle + sweepAngle, startAngle);
		}else{ // draw clockwise angle
			this.context.arc(point.x, point.y, radius, startAngle, startAngle + sweepAngle);
		}
		this.context.stroke(); // all done
		this.context.closePath();
		this.context.setLineDash([]);
		this.context.lineWidth = originalLineWidth;
	});

	Facade.method('drawTriangle', function(triangle){
		// Bounds rect
		this.drawRect(triangle.boundsRect, '#00CCFF', 0.5, [5]);

		// triangle
		this.drawCircle(triangle.topLeft, 6, '#222', 2);
		this.drawCircle(triangle.topRight, 6, '#222', 2);
		this.drawCircle(triangle.bottomRight, 6, '#222', 2);
		this.drawCircle(triangle.bottomLeft, 6, '#222', 2);
		this.drawCircle(triangle.a, 3);
		this.drawCircle(triangle.b, 3);
		this.drawCircle(triangle.c, 3);
		this.drawLine(triangle.a, triangle.b);
		this.drawLine(triangle.b, triangle.c);
		this.drawLine(triangle.c, triangle.a);
		
		// midpoints
		this.drawCircle(triangle.midpointAB, 3);
		this.drawCircle(triangle.midpointBC, 3);
		this.drawCircle(triangle.midpointCA, 3);

		// centroid
		this.drawCircle(triangle.centroid, 4, 'green');
		this.drawLine(triangle.centroid, triangle.midpointAB, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.midpointBC, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.midpointCA, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.a, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.b, '#999', 1, [5]);
		this.drawLine(triangle.centroid, triangle.c, '#999', 1, [5]);
		
		// Altitudes
		// console.log(triangle.altitudeA, triangle.altitudeB, triangle.altitudeC)
		// this.drawLine(triangle.a, new Point(0, triangle.a.y + triangle.altitudeB), 'green', 1);
		// this.drawLine(triangle.b, new Point(triangle.altitudeBC, 0), 'orange', 1, [5]);
		// this.drawLine(triangle.c, new Point(triangle.altitudeCA, 0), 'orange', 1, [5]);

		// Orthocenter
		// this.drawCircle(triangle.orthocenter, 4, 'green');
		// this.drawCircle(triangle.orthocenter, triangle.orthocenter.radius, 'green');
		// this.drawLine(triangle.orthocenter, triangle.a, 'red', 1, [5]);
		// this.drawLine(triangle.orthocenter, triangle.b, 'red', 1, [5]);
		// this.drawLine(triangle.orthocenter, triangle.c, 'red', 1, [5]);
		// console.log(triangle.orthocenter.toString())

		// Incenter
		// this.drawCircle(triangle.incenter, 3);
		
		// Circuncenter
		// this.drawCircle(triangle.circuncenter, 3);

		// Sweep angles
		// console.log(triangle.a.toString(), triangle._directionAB, triangle._directionBC, triangle.minimalDistance);
		// this.drawAngle(triangle.a, triangle._directionAB, triangle._directionCA, triangle.minimalDistance/10, 'red', 1);
		// this.drawAngle(triangle.b, triangle._directionBC, triangle._directionAB, triangle.minimalDistance/10, 'red', 1);
		// this.drawAngle(triangle.c, triangle._directionCA, triangle._directionBC, triangle.minimalDistance/10, 'red', 1);
		// console.log([,
		// 	'angleA:'+ (triangle.angleA * 180 / Math.PI),
		// 	'angleB:'+ (triangle.angleB * 180 / Math.PI),
		// 	'angleC:'+ (triangle.angleC * 180 / Math.PI),
		// 	'total:'+ ((triangle.angleA * 180 / Math.PI) + (triangle.angleB * 180 / Math.PI) + (triangle.angleC * 180 / Math.PI))
		// ].join('\n'));
	});

	Facade.method('render', function(){
		this.context.setTransform(1,0, 0,1, this.CW, this.CH);
		this.context.clearRect(-this.CW, -this.CH, this.SW, this.SH);
		this.context.fillStyle = '#eee';
		this.context.fillRect(-this.CW, -this.CH, this.SW, this.SH);
		// this.drawTriangle(new Triangle(new Point(-150, 0), new Point(150,100), new Point(100,20)));
		// this.drawTriangle(new Triangle(new Point(0, -150), new Point(-150,110), new Point(150,110)));
		// this.drawTriangle(new Triangle(new Point(0, -150), new Point(-150,150), new Point(150,150)));
		this.drawTriangle(new Triangle(new Point(0, -150), new Point(-250,150), new Point(-50,80)));
	});

	return Facade;
});