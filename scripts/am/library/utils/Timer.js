define([
	'./Type',
	'./Class',
	'./Ticker',
	'../events/EventEmitter'
], function(Type, Class, Ticker, EventEmitter){

	var Timer = new Class(function Timer(delay, repeatCount){
		this.super.constructor.call(this);
		this.constructor.UPDATE = 'update';
		this.constructor.COMPLETE = 'complete';
		this.delay = Type.isDefined(delay) ? Type.toFloat(delay) : 1000;
		this.repeatCount = Type.isDefined(repeatCount) ? Type.toInt(repeatCount) : 0;
		this.currentCount = 0;
		this.running = false;
	}).extends(EventEmitter);

	Timer.method('start', function(){
		this.running = true;
		this.lastTime = +new Date();
		Ticker.instance.add(this.update, this);
	});

	Timer.method('stop', function(){
		this.running = false;
		Ticker.instance.remove(this.update, this);
	});

	Timer.method('reset', function(){
		this.currentCount = 0;
		this.running = false;
		this.lastTime = +new Date();
	});

	Timer.method('update', function(time){
		if(this.running && +new Date() - this.lastTime >= this.delay){
			++this.currentCount;
			this.lastTime = +new Date();
			this.trigger(Timer.UPDATE, this);
			if(this.repeatCount !== 0 && this.currentCount >= this.repeatCount){
				this.stop();
				this.trigger(Timer.COMPLETE, this);
			}
		}
	});

	Timer.method('getDuration', function(){
		return(this.delay * this.repeatCount);
	});

	Timer.method('getTime', function(){
		return(this.currentCount * this.delay);
	});

	return Timer;
});
