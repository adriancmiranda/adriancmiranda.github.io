var Profile = (this.Profile || {
    username: 'adriancmiranda',
    PS1: function (cwd, username) {
        var prompt = '$ ';
        if (username) {
            return [
                  '[<span class="branch">master =</span>] '
                , '<span class="user">' + username + '</span>.'
                , '<span class="host">github.io</span>/'
                , '<span class="cwd">' + cwd + '</span>'
                , '<br>' + prompt
            ].join('');
        }
        return prompt;
    }
});