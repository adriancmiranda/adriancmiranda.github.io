/* global Ambox */
(function(scope){
	var Type = scope.uri('Type');
	var Proto = scope.uri('Proto');
	var Vendor = scope.uri('Vendor');
	var iterate = scope.uri('iterate');
	var patterns = scope.uri('patterns');
	var EventProxy = scope.uri('EventProxy');

	// DOMElement
	// @support everywhere
	// @author Adrian C. Miranda <adriancmiranda@gmail.com>
	var DOMElement = new Proto(function DOMElement(node){
		this.node = this.ensureNode(node);
		this.super.constructor.call(this, this.node);
	}).extends(EventProxy);

	DOMElement.static('getWindow', function(node){
		var ownerDoc = node.ownerDocument;
		var windowEl = Type.isWindow(ownerDoc) && ownerDoc;
		var isDoc = Type.isDocument(ownerDoc);
		return(windowEl || isDoc && (ownerDoc.defaultView||ownerDoc.parentWindow));
	});

	DOMElement.static('getStyle', function(node){
		var windowEl = this.getWindow(node);
		if(windowEl && windowEl.opener && windowEl.getComputedStyle){
			return windowEl.getComputedStyle(node, null);
		}else if(window.getComputedStyle){
			return window.getComputedStyle(node, null);
		}else if(node.currentStyle){
			return node.currentStyle;
		}
		return node.style;
	});

	DOMElement.static('support', function(value){
		var has3d, node = document.createElement('i');
		if(Type.isString(value) && patterns.support3d.test(value)){
			this.css(node, 'display', 'block');
			document.body.insertBefore(node, null);
			this.css(node, 'transform', 'translate3d(1px,1px,1px)');
			has3d = this.css(node, 'transform');
			document.body.removeChild(node);
			return(has3d !== null && has3d.length && has3d !== 'none');
		}
		return Type.isDefined(Vendor(node.style, value));
	});

	DOMElement.static('supportTransition', function(){
		if(Type.isDefined(this.hasCSSTransition)){
			return this.hasCSSTransition;
		}
		this.hasCSSTransition = this.support(['transitionProperty', 'transition']);
		return this.hasCSSTransition;
	});

	DOMElement.static('supportTransform', function(){
		if(Type.isDefined(this.hasCSS2d)){
			return this.hasCSS2d;
		}
		this.hasCSS2d = this.support('transform');
		return this.hasCSS2d;
	});

	DOMElement.static('supportTransform3D', function(){
		if(Type.isDefined(this.hasCSS3d)){
			return this.hasCSS3d;
		}
		this.hasCSS3d = this.support('3d');
		return this.hasCSS3d;
	});

	DOMElement.static('css', function(node, prop, value){
		if(Type.isUndefined(value)){
			return Vendor(this.getStyle(node), prop);
		}
		node.style[Vendor.prefixed(node.style, prop)] = value;
	});

	DOMElement.static('nodeName', function(node, expected){
		var name = (node.nodeName||'');
		if(Type.isUndefined(expected)){
			return name;
		}
		return name.toLowerCase() === expected.toLowerCase();
	});

	DOMElement.public('ensureNode', function(node){
		return Type.isDOMElement(node) ? node : this.createDefaultNode();
	});

	DOMElement.public('createDefaultNode', function(){
		return document.createElement('div');
	});

	DOMElement.public('removeClass', function(classList){
		classList = Type.isArray(classList)? classList : classList.split(patterns.spaces);
		if('classList' in document.documentElement){
			this.node.classList.remove.apply(el.classList, classList);
		}else{
			this.node.className = this.node.className.replace(
				patterns.findClass(classList.join('|')), ''
			);
		}
		return this;
	});

	DOMElement.public('addClass', function(classList){
		classList = Type.isArray(classList)? classList : classList.split(patterns.spaces);
		if('classList' in document.documentElement){
			this.node.classList.add.apply(el.classList, classList);
		}else if(!this.hasClass(classList)){
			this.node.className = this.node.className +' '+ classList.join(' ');
		}
		return this;
	});

	DOMElement.public('hasClass', function(classList){
		classList = Type.isArray(classList)? classList : classList.split(patterns.spaces);
		if('classList' in document.documentElement){
			for(var id = 0; id < classList.length; id++){
				if(this.node.classList.contains(classList[id])){
					return true;
				}
			}
			return false;
		}
		return patterns.findClass(className.join('|')).test(this.node.className);
	});

	DOMElement.public('toggleClass', function(className){
		var fn = this.hasClass(className) ? this.removeClass : this.addClass;
		return fn(className);
	});

	DOMElement.charge('css', function(prop){
		return this.constructor.css(this.node, prop);
	});

	DOMElement.charge('css', function(prop, value){
		this.constructor.css(this.node, prop, value);
		return this;
	});

	DOMElement.charge('attr', function(name){
		return this.node.getAttribute(name);
	});

	DOMElement.charge('attr', function(name, value){
		this.node.setAttribute(name, value);
		return this;
	});

	DOMElement.public('removeAttr', function(value){
		var name, propName, id = 0;
		var attrNames = value && value.match(patterns.whiteSpace);
		iterate.index(attrNames, function(attr){
			if(patterns.isBoolAttr.test(attr)){
				this.node[attr] = false;
			}
			this.node.removeAttribute(attr);
		}, this);
	});

	DOMElement.public('show', function(){
		return this.css('display', 'block');
	});

	DOMElement.public('hide', function(){
		return this.css('display', 'none');
	});

	DOMElement.charge('data', function(name){
		return this.attr('data-'+name);
	});

	DOMElement.charge('data', function(name, value){
		return this.attr('data-'+name, value);
	});

	DOMElement.charge('width', function(){
		return this.node.offsetWidth||this.node.getBoundingClientRect().width;
	});

	DOMElement.charge('width', function(value){
		this.css('width', Type.toCSSMeasure(value));
		return this;
	});

	DOMElement.charge('height', function(){
		return this.node.offsetHeight||this.node.getBoundingClientRect().height;
	});

	DOMElement.charge('height', function(value){
		this.css('height', Type.toCSSMeasure(value));
		return this;
	});

	DOMElement.public('offset', function(){
		var bcr, offset = { left:0, top:0 };
		var windowEl = this.constructor.getWindow(this.node);
		var docEl = this.node.ownerDocument.documentElement;
		if(Type.isFunction(this.node.getBoundingClientRect)){
			bcr = this.node.getBoundingClientRect();
		}
		offset.left = bcr.left + windowEl.pageXOffset - docEl.clientLeft;
		offset.top = bcr.top + windowEl.pageYOffset - docEl.clientTop;
		return offset;
	});

	DOMElement.public('offsetParent', function(){
		var docEl = window.document.documentElement;
		var parent = this.node.offsetParent||docEl;
		while(parent && (!this.constructor.nodeName(parent, 'html') && this.constructor.css(parent, 'position') === 'static')){
			parent = parent.offsetParent;
		}
		return new DOMElement(parent||docEl);
	});

	DOMElement.public('position', function(){
		var offset, offsetParent, position = { top:0, left:0 };
		if(this.css('position') === 'fixed'){
			offset = this.node.getBoundingClientRect();
		}else{
			offsetParent = this.offsetParent();
			offset = this.offset();
			if(!this.constructor.nodeName(offsetParent.node, 'html')){
				position = offsetParent.offset();
			}
			position.left += Type.toFloat(offsetParent.css('borderLeftWidth'));
			position.top += Type.toFloat(offsetParent.css('borderTopWidth'));
		}
		position.left = offset.left - position.left - Type.toFloat(this.css('marginLeft'));
		position.top = offset.top - position.top - Type.toFloat(this.css('marginTop'));
		return position;
	});

	scope.uri('DOMElement', DOMElement);

}).call(this, Ambox);
