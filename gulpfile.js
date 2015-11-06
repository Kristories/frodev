var gulp	= require('gulp');
var $		= require('gulp-load-plugins')();
var del		= require('del');
var run		= require('run-sequence');
var path	= {
	development	: {
		root 	: './development/',
		assets	: './development/assets/'
	},
	dist 		: {
		root 	: './dist/',
		assets 	: './dist/assets/'
	}
}

/*********************** HTML ***********************/
gulp.task('html-clean', function() {
    return gulp.src(path.dist.root + '*.html')
    	.pipe($.rimraf());
});

gulp.task('html', ['html-clean'], function () {
	$.nunjucksRender.nunjucks.configure([ path.development.root ], { watch: false });

	return gulp.src(path.development.root + 'pages/*.html')
        .pipe($.nunjucksRender({
            basepath				: path.development.root,
        }))
        .pipe($.htmlmin({ 
        	removeComments 			: true,
        	removeCommentsFromCDATA : true,
        	collapseWhitespace 		: true,
        	minifyJS 				: true,
        	minifyCSS 				: true,
        }))
        .pipe($.prettify({ 
        	indent_size 			: 4,
        	indent_char 			: ' '
        }))
        .pipe(gulp.dest(path.dist.root))
        .pipe($.connect.reload());
});


/*********************** STYLE ***********************/
gulp.task('style-clean', function() {
    return gulp.src(path.dist.assets + 'css/*.css')
    	.pipe($.rimraf());
});

gulp.task('styles', ['style-clean'], function () {
    return gulp.src(path.development.assets + 'less/*.less')
        .pipe($.less())
        .pipe($.minifyCss({
            root                	: path.development.assets + 'less',
            keepSpecialComments 	: false
        }))
        .pipe($.cssbeautify({ autosemicolon : true }))
        .pipe(gulp.dest(path.dist.assets + 'css'))
        .pipe($.minifyCss())
        .pipe($.rename({ suffix : '.min' }))
        .pipe(gulp.dest(path.dist.assets + 'css'))
        .pipe($.connect.reload());
});


/*********************** JAVASCRIPT ***********************/
gulp.task('script-clean', function() {
    return gulp.src(path.dist.assets + 'js/*.js')
    	.pipe($.rimraf());
});

gulp.task('scripts', ['script-clean'], function () {
    return gulp.src(path.development.assets + 'js/*.js')
        .pipe($.include())
        .pipe($.uglify({ compress : true }))
        .pipe($.beautify({ indentSize: 4 }))
        .pipe(gulp.dest(path.dist.assets + 'js'))
        .pipe($.uglify({ compress : true }))
        .pipe($.rename({ suffix : '.min' }))
        .pipe(gulp.dest(path.dist.assets + 'js'))
        .pipe($.connect.reload());
});


/*********************** FONTS ***********************/
gulp.task('fonts-clean', function() {
    return gulp.src(path.dist.assets + 'fonts/*')
    	.pipe($.rimraf());
});

gulp.task('fonts', function () {
	return gulp.src(path.development.assets + '**/*.{otf,eot,svg,ttf,woff}')
        .pipe($.flatten())
        .pipe(gulp.dest(path.dist.assets + 'fonts'))
        .pipe($.connect.reload());
});


/*********************** SERVER ***********************/
gulp.task('server', function() {
    $.connect.server({
        root 		: path.dist.root,
        port 		: 3000,
        livereload 	: true
    });
});


/*********************** WATCH ***********************/
gulp.task('watch', function () {
	gulp.watch(path.development.root + '**/*.html', 	['html']);
	gulp.watch(path.development.assets + 'less/*.less', ['styles']);
	gulp.watch(path.development.assets + 'js/*.js', 	['scripts']);
});


/************** DEFAULT **************/
gulp.task('default', [
	'html', 
	'styles',
	'scripts',
	'fonts',
	'server', 
	'watch'
]);


/************** BUILD **************/
gulp.task('build', [
	'html', 
	'styles',
	'scripts',
	'fonts'
]);