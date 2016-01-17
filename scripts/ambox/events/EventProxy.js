/* global Ambox */
(function(scope){
	var Proto = scope.uri('Proto');
	var event = scope.uri('event');

	// EventProxy
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var EventProxy = new Proto(function EventProxy(target){
		this.target = target||window;
		this.on.guid = 1;
	});

	EventProxy.public('on', function(evt, callback){
		if(!this.target){return void(0);}
		if(this.target.addEventListener){
			this.target.addEventListener(evt, callback, false);
		}else{
			callback.__guid = callback.__guid || this.on.guid++;
			this.target.events = this.target.events || {};
			if(!this.target.events[evt]){
				this.target.events[evt] = {};
				if(this.target['on'+ evt]){
					this.target.events[evt][0] = this.target['on'+ evt];
				}
			}
			this.target.events[evt][callback.__guid] = callback;
			this.target['on'+evt] = this.on.notify;
		}
		return this;
	});

	EventProxy.public('notify', function(evt){
		if(this.target.dispatchEvent){
			this.target.dispatchEvent(new Event(evt));
		}else if(this.target['on'+evt]){
			this.target['on'+evt](new Event(evt));
		}
		return this;
	});

	EventProxy.public('on.notify', function(evt){
		evt = evt || event(((this.ownerDocument || this.document || this).parentWindow || window).event);
		var key, listeners = this.events[evt.type];
		for(key in listeners){
			this.__notifier = listeners[key];
			if(this.__notifier(evt) === false){
				return false;
			}
		}
		return true;
	});

	EventProxy.public('off', function(evt, callback){
		if(!this.target){return void(0);}
		if(this.target.removeEventListener){
			this.target.removeEventListener(evt, callback);
		}else if(this.target.events && this.target.events[evt]){
			delete this.target.events[evt][callback.__guid];
			delete callback.__guid;
		}
		return this;
	});

	scope.uri('EventProxy', EventProxy);

}).call(this, Ambox);