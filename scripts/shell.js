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
			$.commands.Shell = $;
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
		$.terminal = createElement('div');
		$.terminal.classList.add('terminal');
		parentElement.appendChild($.terminal);
		window.onkeypress = function (event) {
			event = event || window.event;
			typeKey(event.which || event.keyCode);
		}.bind($);
		window.onkeydown = function(event) {
			event = event || window.event;
			var key = event.which || event.keyCode;
			if (event.ctrlKey || [8,9,13,46,38,40].indexOf(key) > -1) {
				event.preventDefault();
			}
			typeSpecialKey(event.which || event.keyCode, event.ctrlKey);
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
		dir = (dir || $.cwd);
		var pwd = '';
		while ($.getDir('..', dir.contents).contents !== dir.contents) {
			pwd = '/' + dir.name + pwd;
			dir = $.getDir('..', dir.contents);
		}
		return '~' + pwd;
	};
	
	$.stdout = function () {
		return $.terminal.querySelector('#stdout');
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

	function typeKey(code) {
		var stdout = $.stdout();
		if (!(!stdout || code < 32 || code > 126)) {
			stdout.innerHTML += String.fromCharCode(code);
		}
	}

	function typeSpecialKey(code, ctrl) {
		var stdout = $.stdout();
		if (!stdout) {
			return;
		}
		if ([8,46].indexOf(code) > -1) {
			// Backspace/delete.
            stdout.innerHTML = stdout.innerHTML.replace(/.$/, '');
		} else if (ctrl && [67,68].indexOf(code) > -1) {
			// Ctrl+C, Ctrl+D
		} else if (code == 9) {
			// Tab
		} else if (code == 13) {
			// Enter
		} else if (code == 38) {
			// Up
		} else if (code == 40) {
			// Down
		}
	}

	function prompt() {
		var ps = createElement('div'),
		prompt = createElement('span'),
		stdout = createElement('span');

		removeID('#prompt');
		removeID('#stdout');
		
		prompt.id = 'prompt';
		prompt.classList.add('prompt');
		prompt.innerHTML = $.profile.PS1($.getPWD(), $.profile.username);
		ps.appendChild(prompt);

		stdout.id = 'stdout';
		stdout.classList.add('stdout');
		ps.appendChild(stdout);

		$.terminal.appendChild(ps);
		blinkPointer(0);
		$.scroll();
	}

	function blinkPointer(milliseconds) {
		var stdout, caret = $.terminal.querySelector('#caret');
		if (caret) {
			caret.parentNode.removeChild(caret);
		} else {
			stdout = $.stdout();
			if (stdout) {
				caret = createElement('span');
				caret.id = 'caret';
				caret.classList.add('caret');
				stdout.parentNode.appendChild(caret);
			}
		}
		if (typeOf(milliseconds) === 'number' && milliseconds) {
			window.setTimeout(function () {
				blinkPointer(milliseconds);
			}.bind($), milliseconds);
		}
	}

	function removeID(query) {
		var element = $.terminal.querySelector(query);
		if (element) {
			element.removeAttribute('id');
		}
	}
};