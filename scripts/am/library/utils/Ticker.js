define([
	'./Type',
	'./Class',
	'./Vendor',
	'../events/EventEmitter'
], function(Type, Class, Vendor, EventEmitter){

	var Ticker = new Class(function Ticker(FPS, autoStart){
		if(Ticker.prototype.instance){
			return Ticker.prototype.instance;
		}else if(this instanceof Ticker){
			var hasPerformance = !!(window.performance && window.performance.now);
			var navigationStart = hasPerformance && window.performance.timing.navigationStart;
			this._FPMS = Type.isNumeric(FPS)? Type.toFloat(FPS) / 1000:0.06;
			this._autoStart = Type.isDefined(autoStart)? Type.toBoolean(autoStart):true;
			this._emitter = new EventEmitter();
			this._lastTime = hasPerformance? 0:+new Date();
			this._maxElapsedMS = 100;
			this._elapsedMS = 1 / this._FPMS;
			this._deltaTime = 1;
			this._speed = 1;
			this._startTime = navigationStart || +new Date();
			this._performance = hasPerformance? window.performance:{};
			this._performance.now = this._performance.now || this.$now;
			delete(Ticker.prototype.$now);
			window.requestAnimationFrame = Vendor(window, 'requestAnimationFrame') || this.$request;
			delete(Ticker.prototype.$request);
			window.cancelAnimationFrame = Vendor(window, ['cancelAnimationFrame', 'cancelRequestAnimationFrame']) || this.$cancel;
			delete(Ticker.prototype.$cancel);
			Ticker.prototype.instance = this;
			return this;
		}
		return new Ticker(FPS, autoStart);
	}).static({
		GROUP:'ticker',
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

	Ticker.method('add', function(listener, context){
		this._emitter.on(Ticker.TICK, listener, context, Ticker.GROUP);
		!this._frame && this._autoStart && this.start();
		return this;
	});

	Ticker.method('once', function(listener, context){
		this._emitter.once(Ticker.TICK, listener, context, Ticker.GROUP);
		!this._frame && this._autoStart && this.start();
		return this;
	});

	Ticker.method('remove', function(listener){
		this._emitter.off(Ticker.TICK, listener);
		!this._emitter.listeners[Ticker.TICK] && this.stop();
		return this;
	});

	Ticker.method('start', function(){
		var scope = this;
		if(this._frame || !this._emitter.listeners[Ticker.TICK]){
			return void(0);
		}
		this._lastTime = this._performance.now();
		(function __tick__(now){
			var elapsedMS = scope._elapsedMS = now - scope._lastTime;
			if(elapsedMS > scope._maxElapsedMS){
				elapsedMS = scope._maxElapsedMS;
			}
			scope._deltaTime = elapsedMS * scope._FPMS * scope._speed;
			scope._emitter.emit(Ticker.TICK, scope._deltaTime);
			scope._lastTime = now;
			scope._frame = window.requestAnimationFrame(__tick__);
		}(this._performance.now()));
	});

	Ticker.method('stop', function(){
		window.cancelAnimationFrame(this._frame);
		delete(this._frame);
	});

	Ticker.method('dispose', function(){
		this._emitter.releaseGroup(Ticker.GROUP);
		this.stop();
	});

	Ticker.method('$request', function(callback){
		var currentTime, delay, scope = this;
		currentTime = +new Date();
		delay = 16 + scope._lastTime - currentTime;
		delay = delay < 0 ? 0 : delay;
		scope._lastTime = currentTime;
		return window.setTimeout(function(){
			scope._lastTime = +new Date();
			callback(scope.now());
		}, delay);
	});

	Ticker.method('$cancel', function(frame){
		window.clearTimeout(frame);
	});

	Ticker.method('$now', function(){
		return +new Date() - this._startTime;
	});

	return Ticker;
});
