define([
	'library/utils/Scope'
], function(Scope){

	var namespace = 'am';
	var scope = window[namespace] = {};
	scope.uri = new Scope(scope);
	scope.uri('app.title', 'Adrian Miranda');
	scope.uri('app.authors', [{name:'Adrian C. Miranda', email:'adriancmiranda@gmail.com'}]);
	scope.uri('app.version', 'v0.0.1');
	scope.uri('app.namespace', namespace);
	scope.uri('config.urn', window.location);
	scope.uri('config.origin', scope.config.urn.origin);
	scope.uri('config.protocol', scope.config.urn.protocol.replace(/\:$/, ''));
	scope.uri('config.host', scope.config.urn.host);
	scope.uri('config.hostname', scope.config.urn.hostname);
	scope.uri('config.port', scope.config.urn.port);
	scope.uri('config.pathname', (scope.config.urn.pathname).split('/').slice(0, -1).join('/'));
	scope.uri('config.queryString', scope.config.urn.toString().slice(scope.config.urn.toString().indexOf('?')));
	scope.uri('config.url.assets', scope.config.pathname);
	scope.uri('config.url.base', scope.config.pathname);
	scope.uri('config.url.site', scope.config.protocol +'://'+ scope.config.host + scope.config.pathname);
	scope.uri('config.url.cdn', scope.config.protocol +'://'+ scope.config.host +'/');
	scope.uri('config.parse.appId', 'tODF3mfCoNwYO1hervKBFJKlHO6C09x4qk1VUHmq');
	scope.uri('config.parse.restKey', 'OJVSps1KxfLrc25dY0sVcQAX17vtNx5WqGcVF6lk');
	scope.uri('config.parse.jsKey', 'u2yJ7MpNwzgse7fhzWRQ4TuTmIChXn7fT3BCIoTv');
	scope.uri('events.AUTH.LOGIN_SUCCESS', 'auth-login-success');
	scope.uri('events.AUTH.LOGIN_FAILED', 'auth-login-failed');
	scope.uri('events.AUTH.LOGOUT_SUCCESS', 'auth-logout-success');
	scope.uri('events.AUTH.SESSION_TIMEOUT', 'auth-session-timeout');
	scope.uri('events.AUTH.NOT_AUTHENTICATED', 'auth-not-authenticated');
	scope.uri('events.AUTH.NOT_AUTHORIZED', 'auth-not-authorized');
	scope.uri('roles.USER.ADMIN', 'admin');
	scope.uri('roles.USER.EDITOR', 'editor');
	scope.uri('roles.USER.GUEST', 'guest');
	scope.uri('roles.USER.ALL', '*');

	return scope;
});
