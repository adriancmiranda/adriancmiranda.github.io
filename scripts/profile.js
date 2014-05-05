var Profile = (this.Profile || {
    PS1: function (user, cwd) {
        var pointer = '$ ';
        if (user) {
            return [
                  '<span class="user">' + user + '</span>.'
                , '<span class="host">github.io</span> [master=] '
                , '<span class="cwd">' + cwd + '</span>'
                , '<br>' + pointer
            ].join('');
        }
        return pointer;
    }
});