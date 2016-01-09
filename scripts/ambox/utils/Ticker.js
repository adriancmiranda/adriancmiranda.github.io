/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');
	var Vendor = Ambox.namespace('Vendor');
	var EventEmitter = Ambox.namespace('EventEmitter');

	// AnimationFrame (Ecma5)
	// @role provide a `AnimationFrame` IE9 fallback
	// @see http://caniuse.com/#search=requestAnimationFrame
	var AnimationFrame = new Proto(function AnimationFrame(){
		Proto.rebind(this, 'request');
		var hasPerformance = !!(window.performance && window.performance.now);
		var navigationStart = hasPerformance && window.performance.timing.navigationStart;
		this._startTime = navigationStart || new Date().getTime();
		this._lastTime = hasPerformance? 0 : new Date().getTime();
		this.now = hasPerformance? window.performance.now : this.now;
	});

	AnimationFrame.define('startTime', {
		get:function(){
			return this._startTime;
		}
	});

	AnimationFrame.define('lastTime', {
		get:function(){
			return this._lastTime;
		}
	});

	AnimationFrame.public('request', function(callback, element){
		var time = new Date().getTime();
		var delay = Math.max(0, 16 - (time - this._lastTime));
		var frame = window.setTimeout(function(){
			callback(time + delay, element);
		}, delay);
		this._lastTime = time + delay;
		return frame;
	});

	AnimationFrame.static('cancel', function(frame){
		window.clearTimeout(frame);
	});

	AnimationFrame.public('getTime', function(){
		return new Date().getTime() - this._startTime;
	});

	// Ticker
	// @role
	var Ticker = new Proto(function Ticker(FPS, autoStart){
		if(Ticker.prototype.instance){
			return Ticker.prototype.instance;
		}
		Ticker.prototype.instance = this;
		this._FPMS = Type.isNumeric(FPS)? Type.toFloat(FPS) / 1000 : 0.06;
		this._autoStart = Type.isDefined(autoStart)? Type.toBoolean(autoStart) : true;
		this._maxElapsedMS = 100;
		this._elapsedMS = 1 / this._FPMS;
		this._deltaTime = 1;
		this._speed = 1;
		this._emitter = new EventEmitter();
		this._animationFrame = new AnimationFrame();
		window.requestAnimationFrame = Vendor(window, 'requestAnimationFrame') || this._animationFrame.request;
		window.cancelAnimationFrame = Vendor(window, ['cancelAnimationFrame', 'cancelRequestAnimationFrame']) || this._animationFrame.cancel;
	}).static({
		GROUP:'Ticker',
		TICK:'tick'
	});

	Ticker.define('minFPS', {
		set:function(FPS){
			var minFPMS = Math.min(Math.max(0, FPS) / 1000, this._FPMS);
			this._maxElapsedMS = 1 / minFPMS;
		},
		get:function(){
			return 1000 / this._maxElapsedMS;
		}
	});

	Ticker.define('FPS', {
		get:function(){
			return 1000 / this._elapsedMS
		}
	});

	Ticker.define('running', {
		get:function(){
			return !!this._frame;
		}
	});

	Ticker.public('add', function(listener, context){
		this._emitter.on(Ticker.TICK, listener, context, Ticker.GROUP);
		!this.running && this._autoStart && this.start();
		return this;
	});

	Ticker.public('once', function(listener, context){
		this._emitter.once(Ticker.TICK, listener, context, Ticker.GROUP);
		!this.running && this._autoStart && this.start();
		return this;
	});

	Ticker.public('remove', function(listener){
		this._emitter.off(Ticker.TICK, listener);
		!this._emitter.listeners[Ticker.TICK] && this.stop();
		return this;
	});

	Ticker.public('dispose', function(){
		this._emitter.releaseGroup(Ticker.GROUP);
		this.stop();
	});

	Ticker.public('start', function(){
		if(!this.running && this._emitter.listeners[Ticker.TICK]){
			var scope = this;
			var lastTime = this._animationFrame.getTime();
			(function $(now){
				scope._elapsedMS = now - lastTime;
				if(scope._elapsedMS > scope._maxElapsedMS){
					scope._elapsedMS = scope._maxElapsedMS;
				}
				scope._deltaTime = scope._elapsedMS * scope._FPMS * scope._speed;
				scope._emitter.emit(Ticker.TICK, scope._deltaTime);
				lastTime = now;
				scope._frame = window.requestAnimationFrame($);
			})(lastTime);
		}
	});

	Ticker.public('stop', function(){
		window.cancelAnimationFrame(this._frame);
		delete(this._frame);
	});

	Ticker.public('setRequest', function(callback){
		return new AnimationFrame().request(callback);
	});

	Ticker.public('clearRequest', function(frame){
		AnimationFrame.cancel(frame);
	});

	Ambox.namespace('Ticker', new Ticker(60));

}).call(this, Ambox);