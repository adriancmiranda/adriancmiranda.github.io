define([
	'./Type',
	'./Class',
	'./Timer'
], function(Type, Class, Timer){

	var Timeout = new Class(function Timeout(callback, context, delay, groupName){
		Class.proxyfy(this, '_complete');
		this._callback = callback;
		this._context = context;
		this._groupName = Timeout.createGroup(groupName, this);
		this._params = Type.toArray(arguments, 4);
		this._delay = Type.toFloat(delay);
		this._timer = new Timer(this._delay, 1);
		this._timer.on(Timer.COMPLETE, this._complete, this);
		this._timer.start();
	});

	Timeout.static('createGroup', function(groupName, instance){
		this.group = this.group || [];
		if(!this.group[groupName]){
			this.group[groupName] = [];
		}
		this.group[groupName].push(instance);
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

	Timeout.define('context', {
		get:function(){
			return this._context;
		}
	});

	Timeout.define('delay', {
		get:function(){
			return this._delay * 1000;
		}
	});

	Timeout.define('params', {
		get:function(){
			return this._params;
		}
	});

	Timeout.define('callback', {
		get:function(){
			return this._callback;
		}
	});

	Timeout.define('groupName', {
		get:function() {
			return this._groupName;
		}
	});

	Timeout.method('cancel', function(){
		if(!this._timer){return void 0};
		this._timer.stop();
		this._timer.off(Timer.COMPLETE, this._complete);
		this.destroy();
	});

	Timeout.method('destroy', function(groupName){
		var group = Timeout.getGroup(groupName);
		group.splice(group.indexOf(this), 1);
		this._callback = this._params = this._timer = undefined;
	});

	Timeout.method('_complete', function(evt){
		this._timer.off(Timer.COMPLETE, this._complete);
		if(this._params.length){this._callback.apply(this._context, this._params);}
		else{this._callback.call(this._context);}
		this.destroy();
	});

	return Timeout;
});