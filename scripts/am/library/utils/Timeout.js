define([
	'./Type',
	'./Class',
	'./Timer'
], function(Type, Class, Timer){
	'use strict';

	var Timeout = new Class(function Timeout(method, delay, groupName){
		this.method = method;
		this.params = Array.prototype.slice.call(arguments, 3);
		this.groupName = Timeout.createGroup(groupName);
		this.delay = Type.isDefined(delay) ? Type.toFloat(delay) : 0;
		this.timer = new Timer(this.delay * 1000, 1);
		this.timer.on(Timer.COMPLETE, this.onTimerComplete, this);
		this.timer.start();
	});

	Timeout.static('createGroup', function(groupName){
		this.group = this.group || [];
		if(!this.group[groupName]){
			this.group[groupName] = [];
		}
		this.group[groupName].push(this);
		return groupName;
	});
	
	Timeout.static('getGroup', function(groupName){
		return this.group[groupName] || [];
	});
	
	Timeout.static('cancelGroup', function(groupName){
		var group = this.getGroup(groupName);
		var id = group.length;
		while(id--){
			var timeout = group[id];
			if(timeout && Type.isFunction(timeout.cancel)){
				timeout.cancel();
			}
		}
	});
	
	Timeout.method('onTimerComplete', function(evt){
		this.timer.off(Timer.COMPLETE, this.onTimerComplete);
		if(this.params.length) this.method(this.params);
		else this.method();
		this.destroy();
	});

	Timeout.method('cancel', function(){
		if(!this.timer)return void 0;
		this.timer.stop();
		this.timer.off(Timer.COMPLETE, this.onTimerComplete);
		this.destroy();
	});

	Timeout.method('destroy', function(groupName){
		var group = Timeout.getGroup(groupName);
		group.splice(group.indexOf(this), 1);
		this.method = undefined;
		this.params = undefined;
		this.timer = undefined;
	});

	return Timeout;
});
