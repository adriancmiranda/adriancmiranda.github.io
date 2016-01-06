/* global Ambox */
(function(Ambox){
	var Type = Ambox.namespace('Type');
	var Proto = Ambox.namespace('Proto');
	var Vendor = Ambox.namespace('Vendor');
	var EventEmitter = Ambox.namespace('EventEmitter');

	var Ticker = new Proto(function Ticker(FPS, autoStart){
		if(Ticker.prototype.instance){ return Ticker.prototype.instance; }
		var hasPerformance = !!(window.performance && window.performance.now);
		var navigationStart = hasPerformance && window.performance.timing.navigationStart;
		this._FPMS = Type.isNumeric(FPS)? Type.toFloat(FPS) / 1000 : 0.06;
		this._autoStart = Type.isDefined(autoStart)? Type.toBoolean(autoStart):true;
		this._emitter = new EventEmitter();
		this._lastTime = hasPerformance? 0 : +new Date();
		this._maxElapsedMS = 100;
		this._elapsedMS = 1 / this._FPMS;
		this._deltaTime = 1;
		this._speed = 1;
		this._startTime = navigationStart || +new Date();
		this._performance = hasPerformance? window.performance : Proto.create(null);
		this._performance.now = this._performance.now || this._now;
		delete(Ticker.prototype._now);
		window.requestAnimationFrame = Vendor(window, 'requestAnimationFrame') || this._request;
		delete(Ticker.prototype._request);
		window.cancelAnimationFrame = Vendor(window, ['cancelAnimationFrame', 'cancelRequestAnimationFrame']) || this._cancel;
		delete(Ticker.prototype._cancel);
		Ticker.prototype.instance = this;
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
		!this._frame && this._autoStart && this.start();
		return this;
	});

	Ticker.public('once', function(listener, context){
		this._emitter.once(Ticker.TICK, listener, context, Ticker.GROUP);
		!this._frame && this._autoStart && this.start();
		return this;
	});

	Ticker.public('remove', function(listener){
		this._emitter.off(Ticker.TICK, listener);
		!this._emitter.listeners[Ticker.TICK] && this.stop();
		return this;
	});

	Ticker.public('start', function(){
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

	Ticker.public('stop', function(){
		window.cancelAnimationFrame(this._frame);
		delete(this._frame);
	});

	Ticker.public('dispose', function(){
		this._emitter.releaseGroup(Ticker.GROUP);
		this.stop();
	});

	Ticker.public('_request', function(callback){
		var currentTime, delay, scope = this;
		currentTime = +new Date();
		delay = 16 + scope._lastTime - currentTime;
		scope._lastTime = currentTime;
		return window.setTimeout(function(){
			scope._lastTime = +new Date();
			callback(scope.now());
		}, delay < 0? 0 : delay);
	});

	Ticker.public('_cancel', function(frame){
		window.clearTimeout(frame);
	});

	Ticker.public('_now', function(){
		return +new Date() - this._startTime;
	});

	Ambox.namespace('Ticker', new Ticker(60));

}).call(this, Ambox);