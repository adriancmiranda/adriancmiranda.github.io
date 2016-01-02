define([
	'./Type',
	'./Class',
	'./Ticker',
	'../events/EventEmitter'
], function(Type, Class, Ticker, EventEmitter){

	var Timer = new Class(function Timer(delay, repeatCount, continuous){
		this.super.constructor.call(this);
		Class.proxyfy(this, '_update');
		this._continuous = Type.isDefined(continuous)? Type.toBoolean(continuous):true;
		this._delay = Type.isUndefined(delay)? 1000:Type.toFloat(delay);
		this._repeatCount = Type.toInt(repeatCount);
		this._currentCount = 0;
		this._running = false;
	}).extends(EventEmitter).static({
		COMPLETE:'complete',
		UPDATE:'update'
	});

	Timer.define('delay', {
		set:function(value){
			this._currentCount = 0;
			this._lastTime = +new Date();
			this._delay = Type.toFloat(value);
		},
		get:function(){
			return this._delay;
		}
	});

	Timer.define('repeatCount', {
		set:function(value){
			this._repeatCount = Type.toInt(value);
		},
		get:function(){
			return this._repeatCount;
		}
	});

	Timer.define('running', {
		set:function(value){
			this._running = Type.toBoolean(value);
			this._running? this.start():this.stop();
		},
		get:function(){
			return this._running;
		}
	});

	Timer.define('currentCount', {
		get:function(){
			return this._currentCount;
		}
	});

	Timer.define('duration', {
		get:function(){
			return this._delay * this._repeatCount;
		}
	});

	Timer.define('time', {
		get:function(){
			return this._currentCount * this._delay;
		}
	});

	Timer.method('start', function(){
		this._running = true;
		this._lastTime = +new Date();
		if(this._continuous){
			// this._continuous = Ticker.request(this._update);
		}else{
			Ticker().add(this._update, this);
		}
	});

	Timer.method('stop', function(){
		this._running = false;
		Ticker().remove(this._update, this);
		// Ticker.cancelRequest(this._continuous);
	});

	Timer.method('reset', function(){
		this._currentCount = 0;
		this._running = false;
		this._lastTime = +new Date();
	});

	Timer.method('_update', function(deltaTime){
		if(this._running && +new Date() - this._lastTime >= this._delay){
			++this._currentCount;
			this._lastTime = +new Date();
			this.emit(Timer.UPDATE, this);
			if(this._repeatCount !== 0 && this._currentCount >= this._repeatCount){
				this.stop();
				this.emit(Timer.COMPLETE, this);
			}
		}
	});

	return Timer;
});
