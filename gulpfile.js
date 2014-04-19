(function (gulp, gulpLoadPlugins) {
	'use strict';
	//|
	//|
	//| Gulpfile
	//|
	//| This file is the streaming build system
	//|
	//| .--------------------------------------------------------------.
	//| | NAMING CONVENTIONS:                                          |
	//| |--------------------------------------------------------------|
	//| | Singleton-literals and prototype objects | PascalCase        |
	//| |--------------------------------------------------------------|
	//| | Functions and public variables           | camelCase         |
	//| |--------------------------------------------------------------|
	//| | Global variables and constants           | UPPERCASE         |
	//| |--------------------------------------------------------------|
	//| | Private variables                        | _underscorePrefix |
	//| '--------------------------------------------------------------'
	//|
	//| Comment syntax for the entire project follows JSDoc:
	//| - http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
	//|
	//| For performance reasons we're only matching one level down:
	//| - 'test/spec/{,*/}*.js'
	//|
	//| Use this if you want to recursively match all subfolders:
	//| - 'test/spec/**/*.js'
	//|
	//'
	var $ = gulpLoadPlugins({ pattern: '*', lazy: true }),
		_ = { app: 'source', dist: 'stream' };

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| shortcuts
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('build', []);

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| default
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('default', function() {
		gulp.start('build');
	});
}(require('gulp'), require('gulp-load-plugins')));
