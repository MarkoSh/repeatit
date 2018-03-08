var gulp          = require( "gulp" ),
	gutil         = require( "gulp-util" ),
	scss          = require( "gulp-sass" ),
	browsersync   = require( "browser-sync" ),
	concat        = require( "gulp-concat" ),
	uglify        = require( "gulp-uglify" ),
	cleancss      = require( "gulp-clean-css" ),
	rename        = require( "gulp-rename" ),
	autoprefixer  = require( "gulp-autoprefixer" ),
	notify        = require( "gulp-notify" ),
	rsync         = require( "gulp-rsync" );

gulp.task( "browser-sync", function() {
	browsersync( {
		server: {
			baseDir: "app"
		},
		notify: false,
		// open: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	} )
} );

gulp.task( "scss", function() {
	return gulp.src( "app/scss/**/*.scss" )
	.pipe( scss( { outputStyle: "expand" } ).on( "error", notify.onError() ) )
	.pipe( rename( { suffix: ".min", prefix : "" }))
	.pipe( autoprefixer( [ "last 15 versions" ] ) )
	.pipe( cleancss( { level: { 1: { specialComments: 0 } } } ) ) // Opt., comment out when debugging
	.pipe( gulp.dest( "app/css" ) )
	.pipe( browsersync.reload( { stream: true } ) )
} );

gulp.task( "js", function() {
	return gulp.src( [
		"app/libs/jquery/dist/jquery.min.js",
		"app/js/common.js", // Always at the end
		] )
	.pipe( concat( "scripts.min.js" ) )
	.pipe( uglify() ) // Mifify js (opt.) - mifify hahaha
	.pipe( gulp.dest( "app/js" ) )
	.pipe( browsersync.reload( { stream: true } ) )
} );

gulp.task( "rsync", function() {
	return gulp.src( "app/**" )
	.pipe( rsync({
		root		: "app/",
		hostname	: "username@yousite.com",
		destination	: "yousite/public_html/",
		// include	: [ "*.htaccess" ], // Includes files to deploy
		exclude		: [ "**/Thumbs.db", "**/*.DS_Store" ], // Excludes files from deploy
		recursive	: true,
		archive		: true,
		silent		: false,
		compress	: true
	} ) )
} );

gulp.task( "watch", [ "scss", "js", "browser-sync" ], function() {
	gulp.watch( "app/scss/**/*.scss", [ "scss"] );
	gulp.watch( [ "libs/**/*.js", "app/js/common.js" ], [ "js" ] );
	gulp.watch( "app/*.html", browsersync.reload )
});

gulp.task( "default", [ "watch" ] );
