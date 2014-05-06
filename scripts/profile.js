var Profile = (this.Profile || {
    PS1: function (user, cwd) {
        var prompt = '$ ';
        if (user) {
            return [
                  '<span class="user">' + user + '</span>.'
                , '<span class="host">github.io</span> [master=] '
                , '<span class="cwd">' + cwd + '</span>'
                , '<br>' + prompt
            ].join('');
        }
        return prompt;
    }
});