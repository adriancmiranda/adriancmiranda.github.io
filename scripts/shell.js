var Shell = function (cfg) {
	var $ = this;
	var _historyIndex = -1;
	var _history = [];
	var _queue = [];

	$.startup = function (cb) {
		$.loadProfile(cfg.profile);
		$.loadCommands(cfg.commands);
		$.loadFileSystem(cfg.fs, cb);
	};
	
	$.loadProfile = function (profile) {
		if (typeOf(profile) === 'object') {
			$.profile = profile;
		}
	};
	
	$.loadCommands = function (commands) {
		if (typeOf(commands) === 'object') {
			$.commands = commands;
			$.commands._shell = $;
		}
	};

	$.loadFileSystem = function (fs, cb) {
		if (typeOf(fs) === 'string') {
			require(fs, function (response) {
				$.fs = JSON.parse(response);
				attachDir($.fs, $.fs);
				if (typeOf(cb) === 'function') {
					cb.apply($, [$.fs]);
				}
			}.bind($));
		} else if (typeof cb === 'function') {
			cb.apply($, []);
		}
	};

	$.queue = function (command) {
		_queue.push(command);
		return $;
	};

	$.run = function (element) {
		var parentElement = element || window.document.body;
		$.holder = createElement('div');
		$.holder.classList.add('terminal');
		parentElement.appendChild($.holder);
		window.onkeypress = function (event) {
			event = event || window.event
			type(event.which || event.keyCode);
		}.bind($);
		$.cwd = $.fs;
		prompt();
		blinkPointer(700);
	};

	$.scroll = function () {
		window.scrollTo(0, window.document.body.scrollHeight);
	};

	$.getDir = function (name, dir) {
		for (var id in dir) {
			if (dir[id].name == name) {
				if (dir[id].type == 'link') {
					return dir[id].contents;
				} else {
					return dir[id];
				}
			}
		}
		return null;
	};

	$.getPWD = function (dir) {
		var pwd = '';
		 while ($.getDir('..', dir.contents).contents !== dir.contents) {
			pwd = '/' + dir.name + pwd;
			dir = $.getDir('..', dir.contents);
		 }
		 return '~' + pwd;
	};

	$.getCWD = function () {
		return $.getPWD($.cwd);
	};
	
	$.cursor = function () {
		return $.holder.querySelector('#cursor');
	};

	function attachDir(currentDir, parentDir) {
		currentDir.contents.forEach(function (entry, index, dir) {
			if (entry.type == 'dir') {
				attachDir(entry, currentDir);
			}
		}.bind($));
		
		currentDir.contents.unshift({
			'name': '..',
			'type': 'link',
			'contents': parentDir
		});

		currentDir.contents.unshift({
			'name': '.',
			'type': 'link',
			'contents': currentDir
		});
	}

	function execute() {
		return null;
	}

	function type(key) {
		var cursor = $.cursor();
		if (cursor) {
			cursor.innerHTML += String.fromCharCode(key);
		}
	}

	function prompt() {
		var ps = createElement('div'),
		prompt = createElement('span'),
		cursor = createElement('span');

		removeID('#prompt');
		removeID('#cursor');
		
		prompt.id = 'prompt';
		prompt.classList.add('prompt');
		prompt.innerHTML = $.profile.PS1($.getCWD(), $.profile.username);
		ps.appendChild(prompt);

		cursor.id = 'cursor';
		cursor.classList.add('cursor');
		ps.appendChild(cursor);

		$.holder.appendChild(ps);
		blinkPointer(0);
		$.scroll();
	}

	function blinkPointer(milliseconds) {
		var cursor, caret = $.holder.querySelector('#caret');
		if (caret) {
			caret.parentNode.removeChild(caret);
		} else {
			cursor = $.cursor();
			if (cursor) {
				caret = createElement('span');
				caret.id = 'caret';
				caret.classList.add('caret');
				cursor.parentNode.appendChild(caret);
			}
		}
		if (typeOf(milliseconds) === 'number' && milliseconds) {
			window.setTimeout(function () {
				blinkPointer(milliseconds);
			}.bind($), milliseconds);
		}
	}

	function removeID(query) {
		var element = $.holder.querySelector(query);
		if (element) {
			element.removeAttribute('id');
		}
	}
};