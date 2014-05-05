var XMLHttpFactories = [
	function () { return new XMLHttpRequest() },
	function () { return new ActiveXObject('Msxml2.XMLHTTP') },
	function () { return new ActiveXObject('Msxml3.XMLHTTP') },
	function () { return new ActiveXObject('Microsoft.XMLHTTP') }
];

function createXMLHTTPObject() {
	var xmlhttp = false, id = 0;
	for (; id < XMLHttpFactories.length; id++) {
		try {
			xmlhttp = XMLHttpFactories[id]();
		} catch (error) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

function require(path, cb, postData) {
	var request = createXMLHTTPObject(),
	method = String(postData).toUpperCase() === 'POST' ? 'POST' : 'GET';
	if (!request) {
		return;
	}
	request.open(method, path, true);
	if (postData) {
		request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	}
	request.onreadystatechange = function () {
		if (request.readyState != 4) {
			return;
		}
		if (request.status != 200 && request.status != 304) {
			return;
		}
		cb(request.responseText);
	}
	if (request.readyState == 4) {
		return;
	}
	request.send(postData);
}

function getDefinitionName(value, strict) {
	if (value === false) {
		return 'Boolean';
	}
	if (value === '') {
		return 'String';
	}
	if (value === 0) {
		return 'Number';
	}
	if (value && value.constructor) {
		var name = value.constructor.toString()
		.replace(/^.*function([^\s]*|[^\(]*)\([^\x00]+$/, '$1')
		.replace(/^(\[object\s)|]$/g, '')
		.replace(/\s+/, '') || 'Object';
		if (strict !== true) {
			if (!/^(Boolean|RegExp|Number|String|Array|Date)$/.test(name)) {
				return 'Object';
			}
		}
		return name;
	}
	return value;
}

function typeOf(value, strict) {
	var type = typeof value;
	if (value === false) {
		return 'boolean';
	}
	if (value === '') {
		return 'string';
	}
	if (value && type === 'object') {
		type = getDefinitionName(value, strict);
		type = String(type).toLowerCase();
	}
	if (type === 'number' && !window.isNaN(value) && window.isFinite(value)) {
		if (strict === true && window.parseFloat(value) === window.parseInt(value, 10)) {
			return value < 0 ? 'int' : 'uint';
		}
		return 'number';
	}
	return value ? type : value;
}