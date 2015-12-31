define([
	'scope',
	'library/net/Request'
], function(scope, Request){
	
	var ParseAPI = new Class(function ParseAPI(){
		this.super.constructor.call(this);
		// this.defaults.headers.common['X-Parse-Application-Id'] = scope.config.parse.appId;
		// this.defaults.headers.common['X-Parse-REST-API-Key'] = scope.config.parse.restKey;
	}).extends(Request);


	// Utils
	// =====

	ParseAPI.static('toUpdateOps', function(className, objects, data){
		return [];
	});

	ParseAPI.static('toDeleteOps', function(className, objects){
		return [];
	});


	// Users
	// =====

	ParseAPI.method('findUser', function(query){
		return this.find('_User', query);
	});

	ParseAPI.method('signUp', function(data){
		return null;
	});

	ParseAPI.method('logIn', function(username, password){
		return null;
	});

	ParseAPI.method('logOut', function(){
		return null;
	});

	ParseAPI.method('requestPasswordReset', function(email){
		return null;
	});

	ParseAPI.method('me', function(token){
		return null;
	});

	ParseAPI.method('updateUser', function(objectId, data){
		return null;
	});

	ParseAPI.method('updateUserEmail', function(objectId, data){
		return null;
	});

	ParseAPI.method('updateUserName', function(objectId, data){
		return null;
	});

	ParseAPI.method('deleteUser', function(objectId, data){
		return null;
	});

	ParseAPI.method('deleteAllUsers', function(query){
		return null;
	});


	// Sessions
	// ========

	ParseAPI.method('currentSession', function(){
		return null;
	});

	ParseAPI.method('retrieveSession', function(token){
		return null;
	});

	ParseAPI.method('updateSession', function(token, objectId, data){
		return null;
	});

	ParseAPI.method('deleteSession', function(token){
		return null;
	});

	ParseAPI.method('deleteAllSessions', function(query){
		return null;
	});


	// Roles
	// =====

	ParseAPI.method('createRole', function(data){
		return null;
	});

	ParseAPI.method('retrieveRole', function(objectId){
		return this.get('/roles/'+ objectId);
	});

	ParseAPI.method('updateRole', function(objectId, data){
		return this.put('/roles/'+ objectId, data, { 'Content-Type':'application/json' });
	});

	ParseAPI.method('deleteRole', function(objectId){
		return null;
	});


	// Objects
	// =======

	ParseAPI.method('createObject', function(className, data){
		return this.post('/classes/'+ className, data, { 'Content-Type':'application/json' });
	});

	ParseAPI.method('retrieveObject', function(className, objectId, query){
		return this.get('/classes/'+ className +'/'+ objectId + '/?'+ (query||''));
	});

	ParseAPI.method('updateObject', function(className, objectId, data){
		return this.put('/classes/'+ className +'/'+ objectId, data, { 'Content-Type':'application/json' });
	});

	ParseAPI.method('deleteObject', function(className, objectId){
		return this.delete('/classes/'+ className +'/'+ objectId);
	});

	ParseAPI.method('retrieveCollection', function(className, query){
		return this.get('/classes/'+ className + '/?'+ (query||''));
	});

	ParseAPI.method('updateCollection', function(className, query, data){
		return this.find(className, query||'').then(function(response){
			var requests = ParseAPI.toUpdateOps(className, response.data.results, data);
			return this.batch(requests);
		}.bind(this));// XXX
	});

	ParseAPI.method('deleteCollection', function(className, query){
		return this.find(className, query||'').then(function(response){
			var requests = ParseAPI.toDeleteOps(className, response.data.results);
			return this.batch(requests);
		}.bind(this));// XXX
	});

	ParseAPI.method('addUnique', function(relationName, className, objectId, objects){
		var data = Class.create(null);
		data[relationName] = {__op:'AddUnique',objects:[].concat(objects)};
		return this.put('/classes/'+ className +'/'+ objectId, data, { 'Content-Type':'application/json' });
	});

	ParseAPI.method('addRelation', function(relationName, classNameA, objectIdA, classNameB, objectIdB){
		var data = Class.create(null);
		data[relationName] = {__op:'AddRelation',objects:[{__type:'Pointer',className:classNameB,objectId:objectIdB}]};
		return this.put('/classes/'+ classNameA +'/'+ objectIdA, data, { 'Content-Type':'application/json' });
	});

	ParseAPI.method('removeRelation', function(relationName, classNameA, objectIdA, classNameB, objectIdB){
		var data = Class.create(null);
		data[relationName] = {__op:'RemoveRelation',objects:[{__type:'Pointer',className:classNameB,objectId:objectIdB}]};
		return this.put('/classes/'+ classNameA +'/'+ objectIdA, data, { 'Content-Type':'application/json' });
	});


	// Files
	// =====

	ParseAPI.method('createFile', function(filename, data, contentType){
		return this.post('/files/'+ fileName, data, { 'Content-Type':contentType });
	});


	// Requests
	// ========

	ParseAPI.method('find', function(className, query){
		return null;
	});

	ParseAPI.method('findWithObjectId', function(className, objectId, callback){
		return this.get('/'+ (className === '_User' ? 'users' : 'classes/'+ className +'/'+ objectId), null);
	});

	ParseAPI.method('createCustom', function(className, data, headers){
		return this.post('/'+ className, data, headers);
	});

	ParseAPI.method('batch', function(requests){
		return this.post('/batch', { requests:requests }, { 'Content-Type':'application/json' });
	});

	ParseAPI.method('delete', function(action, headers){
		return this.super.call('https://api.parse.com/1'+ action, { headers:headers });
	});

	ParseAPI.method('post', function(action, data, headers){
		return this.super.call('https://api.parse.com/1'+ action, data, { headers:headers });
	});

	ParseAPI.method('put', function(action, data, headers){
		return this.super.call('https://api.parse.com/1'+ action, data, { headers:headers });
	});

	ParseAPI.method('get', function(action, headers){
		return this.super.call('https://api.parse.com/1'+ action, { headers:headers });
	});

	return ParseAPI;
});