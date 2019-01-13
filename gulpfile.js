var fs			  = require( "fs" ),
	gulp          = require( "gulp" ),
	gutil         = require( "gulp-util" ),
	scss          = require( "gulp-sass" ),
	browsersync   = require( "browser-sync" ),
	concat        = require( "gulp-concat" ),
	uglify        = require( "gulp-uglify" ),
	cleancss      = require( "gulp-clean-css" ),
	rename        = require( "gulp-rename" ),
	autoprefixer  = require( "gulp-autoprefixer" ),
	notify        = require( "gulp-notify" ),
	typescript 	  = require( "gulp-tsc" ),
	rsync         = require( "gulp-rsync" ),
	gcmq          = require( "gulp-group-css-media-queries" ),
	htmlmin		  = require( "gulp-htmlmin" );

let styles = () => {
	return gulp.src( "app/scss/main.scss" )
		.pipe( scss( { outputStyle: "expand" } ).on( "error", notify.onError() ) )
		.pipe( rename( { suffix: ".min", prefix : "" }))
		.pipe( autoprefixer( [ "last 15 versions" ] ).on( "error", notify.onError() ) )
		.pipe( cleancss( { level: { 1: { specialComments: 0 } } } ).on( "error", notify.onError() ) ) // Opt., comment out when debugging
		.pipe( gulp.dest( "app/css" ) )
		.pipe( browsersync.reload( { stream: true } ) );
}

let ts = () => {
	return gulp.src( "app/ts/scripts.ts" )
		.pipe( typescript().on( "error", notify.onError() ) )
		.pipe( gulp.dest( "app/js" ) );
}

let js = () => {
	return gulp.src( [
			"node_modules/axios/dist/axios.min.js",

			"node_modules/inputmask/dist/min/inputmask/dependencyLibs/inputmask.dependencyLib.min.js",
			"node_modules/inputmask/dist/min/inputmask/inputmask.min.js",
			"node_modules/inputmask/dist/min/inputmask/inputmask.extensions.min.js",
			"node_modules/inputmask.phone/dist/min/inputmask.phone/inputmask.phone.extensions.min.js",

			"node_modules/photoswipe/dist/photoswipe.min.js",
			"node_modules/photoswipe/dist/photoswipe-ui-default.min.js",

			"node_modules/swiper/dist/js/swiper.min.js",

			"app/js/scripts.js", // Always at the end
		] )
		.pipe( concat( "scripts.min.js" ) )
		.pipe( uglify().on( "error", notify.onError() ) ) // Mifify js (opt.) - mifify hahaha
		.pipe( gulp.dest( "app/js" ) )
		.pipe( browsersync.reload( { stream: true } ) );
}

let browser_sync = () => {
	browsersync( {
		server: {
			baseDir: 'app'
		},
		notify: false
	} );
}

let watchFiles = () => {
	gulp.watch( "**/*.scss", styles );
	gulp.watch( "app/ts/scripts.ts", ts );
	gulp.watch( "app/js/scripts.js", js );
	gulp.watch( "app/index.html", browsersync.reload );

	fs.watchFile( "app/css/style.min.css", {
		interval: 100
	}, ( current, previous ) => {
		if ( current.size == 0 ) {
			gulp.parallel( styles );
		}
	} );

	fs.watchFile( "app/js/scripts.min.js", {
		interval: 100
	}, ( current, previous ) => {
		if ( current.size == 0 ) {
			gulp.parallel( js );
		}
	} );
}

gulp.task( "watch", gulp.parallel( [ watchFiles, browser_sync ] ) );