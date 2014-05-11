var Commands = (this.Commands || {
    login: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    clear: function(argv, cb) {
        this.commands.Shell.terminal.innerHTML = '';
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    gimp: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },

    open: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    sudo: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    tree: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    help: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    cat: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },
    
    ls: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    },

    cd: function(argv, cb) {
        if (typeOf(cb) === 'function') {
            cb();
        }
    }
});