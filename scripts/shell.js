var Shell = function (cfg) {
	var _history = [];
	var _queue = [];

	this.startup = function (cb) {
		this.loadProfile(cfg.profile);
		this.loadCommands(cfg.commands);
		this.loadFileSystem(cfg.fs, cb);
	};
	
	this.loadProfile = function (profile) {
		if (typeOf(profile) === 'object') {
			this.profile = profile;
		}
	};
	
	this.loadCommands = function (commands) {
		if (typeOf(commands) === 'object') {
			this.commands = commands;
			this.commands._prompt = this;
		}
	};

	this.loadFileSystem = function (fs, cb) {
		if (typeOf(fs) === 'string') {
			require(fs, function (response) {
				this.fs = JSON.parse(response);
				attachDir(this.fs, this.fs);
				if (typeOf(cb) === 'function') {
					cb.apply(this, [this.fs]);
				}
			}.bind(this));
		} else if (typeof cb === 'function') {
			cb.apply(this, []);
		}
	};

	this.queue = function (command) {
		_queue.push(command);
		return this;
	};

	this.run = function (element) {
		var parentElement = element || window.document.body;
		this.holder = window.document.createElement('div');
		this.holder.classList.add('terminal');
		parentElement.appendChild(this.holder);
		this.cwd = this.fs;
		prompt();
	};

	this.scroll = function () {
		window.scrollTo(0, window.document.body.scrollHeight);
	};

	function attachDir(currentDir, parentDir) {
		currentDir.contents.forEach(function (entry, index, dir) {
			if (entry.type == 'dir') {
				attachDir(entry, currentDir);
			}
		}.bind(this));
		
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

	function prompt() {
		var div = window.document.createElement('div'),
		prompt = window.document.createElement('span'),
		command = window.document.createElement('span');
		div.appendChild(prompt);
		div.appendChild(command);
	}
};