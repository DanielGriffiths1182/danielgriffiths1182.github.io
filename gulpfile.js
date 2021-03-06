// --------------------------------------------------
// [Gulpfile]
// --------------------------------------------------

'use strict';

var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	changed 	= require('gulp-changed'),
	cleanCSS 	= require('gulp-clean-css'),
	rtlcss 		= require('gulp-rtlcss'),
	rename 		= require('gulp-rename'),
	uglify 		= require('gulp-uglify'),
	pump 		= require('pump'),
	htmlhint  	= require('gulp-htmlhint');


// Gulp plumber error handler
function errorLog(error) {
	console.error.bind(error);
	this.emit('end');
}


// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass - Compile Sass files into CSS
gulp.task('sass', function () {
	gulp.src('sass/**/*.scss')
		.pipe(changed('css/'))
		.pipe(sass({ outputStyle: 'expanded' }))
		.on('error', sass.logError)
		.pipe(gulp.dest('../css/'));
});


// Minify CSS
gulp.task('minify-css', function() {
	// Theme
    gulp.src(['css/layout.css', '!css/layout.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css/'));

    // RTL
    gulp.src(['css/layout-rtl.css', '!css/layout-rtl.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css/'));
});


// RTL CSS - Convert LTR CSS to RTL.
gulp.task('rtlcss', function () {
	gulp.src(['css/layout.css', '!css/layout.min.css', '!css/layout-rtl.css', '!css/layout-rtl.min.css'])
	.pipe(changed('css/'))
		.pipe(rtlcss())
		.pipe(rename({ suffix: '-rtl' }))
		.pipe(gulp.dest('css/'));
});


// Minify JS - Minifies JS
gulp.task('uglify', function (cb) {
  	pump([
	        gulp.src(['js/**/*.js', '!js/**/*.min.js']),
	        uglify(),
			rename({ suffix: '.min' }),
	        gulp.dest('js/')
		],
		cb
	);
});


// Htmlhint - Validate HTML
gulp.task('htmlhint', function() {
	gulp.src('*.html')
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
	  	.pipe(htmlhint.failReporter({ suppress: true }))
});


// --------------------------------------------------
// [Gulp Task - Watch]
// --------------------------------------------------

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['sass', 'minify-css', 'rtlcss', 'uglify', 'htmlhint', 'watch']);

// This handles watching and running tasks
gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('css/layout.css', ['minify-css']);
    gulp.watch('css/layout.css', ['rtlcss']);
    gulp.watch('js/**/*.js', ['uglify']);
    gulp.watch('*.html', ['htmlhint']);
});
