var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sh = require('shelljs');
var mainBowerFiles = require('main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
    app: [
        './src/app/app.js',
        './src/app/**/index.js',
        './src/app/**/*.js'
    ],
    html: ['./src/app/**/*.html'],
    images: ['./src/img/**/*.{gif,jpg,png}'],
    sass: ['./src/scss/**/*.scss']
};

gulp.task('default', ['watch']);

gulp.task('app', function () {
    gulp.src(paths.app)
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(gulp.dest('./www/js/'))
});

gulp.task('html', function () {
    gulp.src(paths.html)
        .pipe(gulp.dest('./www/'))
});

gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(gulp.dest('./www/img/'))
});

gulp.task('sass', function (done) {
    gulp.src('./src/scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('vendor', function () {
    return gulp.src(mainBowerFiles({
        filter: /.*\.js/,
        includeDev: true
    }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./www/js/'))
});

gulp.task('build', function () {
    gulp.start('app');
    gulp.start('images');
    gulp.start('html');
    gulp.start('sass');
    gulp.start('vendor');
});

gulp.task('watch', function () {
    gulp.watch(paths.app, ['app']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.vendor, ['vendor']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
