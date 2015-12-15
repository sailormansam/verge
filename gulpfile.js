var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	minifycss = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	htmlreplace = require('gulp-html-replace'),
	copy = require('gulp-copy'),
	del = require('del');

gulp.task('default', ['del'], function () {
	gulp.start('minify-js-game', 'minify-js-editor', 'minify-js-lib', 'html-replace-index', 'html-replace-editor', 'minify-css', 'imagemin', 'copy', 'copy-fonts');
});

gulp.task('del', function (cb) {
	del(['dist/**', '!dist'], cb);
});

gulp.task('html-replace-index', function () {
	return gulp.src('index.html')
		.pipe(htmlreplace({ js: ['js/game.min.js', 'js/lib.min.js'], css: 'css/main.min.css' }))
		.pipe(gulp.dest('dist'));
});

gulp.task('html-replace-editor', function () {
	return gulp.src('editor.html')
		.pipe(htmlreplace({ js: ['js/editor.min.js', 'js/lib.min.js'], css: 'css/main.min.css' }))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify-js-game', function () {
	return gulp.src('js/game/*.js')
		.pipe(concat('game.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('minify-js-editor', function () {
	return gulp.src('js/editor/*.js')
		.pipe(concat('editor.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('minify-js-lib', function () {
	return gulp.src('js/lib/*.js')
		.pipe(concat('lib.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function () {
	return gulp.src('css/*.css')
		.pipe(concat('main.css'))
		.pipe(minifycss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('imagemin', function () {
	return gulp.src('images/*')
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('copy', function () {
	return gulp.src('phaser.min.js')
		.pipe(copy('dist', { prefix: 1 }));
});

gulp.task('copy-fonts', function() {
	return gulp.src('fonts/**')
		.pipe(copy('dist/fonts', { prefix: 1 }));
});
