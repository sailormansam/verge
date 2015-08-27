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
	gulp.start('minify-js', 'minify-css', 'imagemin', 'html-replace', 'copy');
});

gulp.task('del', function (cb) {
	del(['dist/**', '!dist'], cb);
});

gulp.task('html-replace', function () {
	return gulp.src('src/index.html')
		.pipe(htmlreplace({ js: 'main.min.js', css: 'main.min.css' }))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify-js', function () {
	return gulp.src('src/js/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function () {
	return gulp.src('src/css/*.css')
		.pipe(concat('main.css'))
		.pipe(minifycss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('imagemin', function () {
	return gulp.src('src/images/*')
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('copy', function () {
	return gulp.src('src/phaser.min.js')
		.pipe(copy('dist', { prefix: 1 }));
});
