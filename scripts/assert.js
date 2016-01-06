(function(scope){
	var output = document.getElementById('output');
	function assert(outcome, description){
		var li = document.createElement('li');
		li.className = outcome? 'pass' : 'fail';
		li.appendChild(document.createTextNode(description));
		output && output.appendChild(li);
	};
	scope.assert = assert;
}).call(this, this);