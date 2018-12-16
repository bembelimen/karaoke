var gulp         = require('gulp');
var rename       = require('gulp-rename');
var runSequence  = require('run-sequence');
var browserSync  = require('browser-sync').create();
var del          = require('del');
var rev          = require('gulp-rev');

gulp.task('default', function (cb)
{
	runSequence('clean', 'rebuild', 'build', cb);
});

gulp.task('rebuild', function(cb)
{
	// rebuild "dist" folder
	return gulp.src('*.*', {read: false})
			.pipe(gulp.dest('./dist'));
});

gulp.task('clean', function(cb)
{
	return del(['dist']);
});

gulp.task('build', function(cb)
{
	runSequence('sass', 'js', 'html', 'images', cb);
});

gulp.task('run', function(cb)
{
	runSequence('clean', 'build', 'browserSync', 'watch', cb);
});

gulp.task('sass', function()
{
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
	var sass         = require('gulp-sass');
    var autoprefixer = require('autoprefixer');
	var cssnano      = require('cssnano');
	var sorting      = require('postcss-sorting');

	sass.compiler = require('sass');

    return gulp.src(['./src/scss/*.scss', '!src/scss/_*.scss'])
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(postcss([ sorting(), autoprefixer() ]))
			.pipe(rev())
			.pipe(gulp.dest('./dist/css'))
			.pipe(postcss([ cssnano() ]))
			.pipe(rename(function(file) {
				file.basename += '.min';
				file.extname = '.css';
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./dist/css'))
			.pipe(browserSync.reload({
			  stream: true
			}));
});

gulp.task('js', function()
{
	var uglify = require('gulp-uglify');

	return gulp.src(['./src/js/*.js'])
			.pipe(gulp.dest('./dist/js'))
			.pipe(uglify())
			.pipe(rev())
			.pipe(rename(function(file) {
				file.basename += '.min';
			}))
			.pipe(gulp.dest('./dist/js'))
			.pipe(browserSync.reload({
			  stream: true
			}));
});

gulp.task('html', function()
{
	var inject      = require('gulp-inject');
	var injectFiles = gulp.src(['dist/css/*.min.css', 'dist/js/*.min.js']);
	var injectOptions = {
		addRootSlash: false,
		ignorePath: ['src', 'dist']
	};

	return gulp.src('./src/presenter.html')
			.pipe(inject(injectFiles, injectOptions))
			.pipe(rename('index.html'))
			.pipe(gulp.dest('./dist/'))
			.pipe(browserSync.reload({
			  stream: true
			}));
});

gulp.task('images', function()
{
	return gulp.src(['./src/slides/*-slide.jpg', './src/slides/*-slide.png'])
			.pipe(gulp.dest('./dist/images'))
			.pipe(browserSync.reload({
			  stream: true
			}));
});

gulp.task('watch', function()
{
	gulp.watch('src/scss/*.scss', ['default']);
	gulp.watch('src/js/*.js', ['default']);
	gulp.watch('src/*.html', ['default']);
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
	});
});
