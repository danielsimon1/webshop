var gulp = require('gulp');

var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var http = require('http');
var st = require('st');
var runSequence = require('run-sequence');

var plumber = require('gulp-plumber');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat-util');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var livereload = require('gulp-livereload');

var clean = require('gulp-clean');

var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');

var using = require('gulp-using');

var config = require('./gulpfile.config.js');

gulp.task('sass', function (done) {
    gulp.src(config.paths.sassMain)
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole : true}))
        .pipe(gulp.dest(config.paths.dist + '/assets/css/'))
        .pipe(minifyCss({
            keepSpecialComments : 0
        }))
        .pipe(rename({extname : '.min.css'}))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(config.paths.dist + '/assets/css/'))
        .pipe(livereload())
        .on('end', done);
});

gulp.task('assets', function (done) {

    gulp.src(config.paths.assets, {
        base : config.paths.assetsBase
    })
        .pipe(gulp.dest(config.paths.dist))
        .on('end', done);
});

gulp.task('clean', function () {
    return gulp.src(config.paths.dist, {read : false})
        .pipe(clean());
});

gulp.task('js', function (done) {
    gulp.src(config.paths.js)
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(concat('app', {
            process : function (src) {
                return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
            }
        }))
        .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
        .pipe(concat.footer('\n})(window, document);\n'))
        .pipe(rename({
            extname : ".js"
        }))
        .pipe(gulp.dest(config.paths.dist + '/assets/js/'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            extname : ".min.js"
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(config.paths.dist + '/assets/js/'))
        .pipe(livereload())
        .on('end', done);
});

gulp.task('index', function () {
    return gulp.src(config.paths.index)
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('templatecache', function (done) {
    gulp.src(config.paths.html)
        .pipe(minifyHTML({
            //conditionals : true,
            //spare : true
        }))
        .pipe(templateCache({
            standalone : true
            //root : 'templates'
        }))
        .pipe(gulp.dest(config.paths.dist + '/assets/js/'))
        .pipe(livereload())
        .on('end', done);
});

gulp.task('bower', ['bower-css', 'bower-js', 'bower-assets']);

gulp.task('bower-js', function (done) {
    gulp.src(config.bower.js, {cwd : config.paths.bower})
        .pipe(using())
        .pipe(sourcemaps.init())
        .pipe(concat('bower.js'))
        .pipe(gulp.dest(config.paths.dist + '/assets/js/'))
        .pipe(sourcemaps.write('/'))
        .on('end', done);
});

gulp.task('bower-css', function (done) {
    gulp.src(config.bower.css, {cwd : config.paths.bower})
        .pipe(using())
        .pipe(sourcemaps.init())
        .pipe(concat('bower.css'))
        //.pipe(gulp.dest(config.paths.dist + '/css/'))
        .pipe(minifyCss({
            keepSpecialComments : 0
        }))
        .pipe(gulp.dest(config.paths.dist + '/assets/css/'))
        //.pipe(rename({extname : '.min.css'}))
        .pipe(sourcemaps.write('/'))
        .on('end', done);
});

var defaultTasks = [];

function createTask(key) {
    gulp.task(key, function (done) {

        var folder = (config.bower.assets[key].dist) ? config.bower.assets[key].dist : 'assets/';

        gulp.src(config.bower.assets[key].src, {
            base : config.paths.bower + '/' + config.bower.assets[key].base,
            cwd : config.paths.bower
        })
            .pipe(using())
            .pipe(gulp.dest(config.paths.dist + '/' + folder))
            .on('end', done);
    });
}

for (var key in config.bower.assets) {
    createTask(key);
    defaultTasks.push(key);
}

gulp.task('bower-assets', defaultTasks);

gulp.task('html', function (done) {
    gulp.src(config.paths.html)
        .pipe(livereload())
        .on('end', done);
});

gulp.task('server', function (done) {
    http.createServer(
        st({path : __dirname + '/' + config.paths.dist, index : 'index.html', cache : false})
    ).listen(8000, done);
    console.log('Post: ' + 8000);
});

gulp.task('watch', function (done) {

    runSequence(
        'clean',
        ['index', 'bower', 'assets', 'sass', 'templatecache', 'js', 'server'],
        done);

    //livereload.listen({basePath : config.paths.dist});
    livereload.listen();

    gulp.watch(config.paths.index, ['index']);
    gulp.watch(config.paths.sass, ['sass']);
    gulp.watch(config.paths.html, ['templatecache', 'html']);

    //gulp.watch(config.paths.templatecache, ['templatecache']);
    gulp.watch(config.paths.js, ['templatecache', 'js']);
    //gulp.watch(config.paths.bower, ['bower']);
});