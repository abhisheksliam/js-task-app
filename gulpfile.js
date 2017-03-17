// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp    = require('gulp');
var clean   = require('gulp-clean');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var less    = require('gulp-less');
var csso    = require('gulp-csso');
var es      = require('event-stream');
var express = require('express');
var http    = require('http');

gulp.task('clean', function () {
    // Clear the destination folder
    gulp.src('dist/**/*.*', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('copy', function () {
    // Copy all application files except app *.less and .js into the `dist` folder
    return es.concat(
        // gulp.src(['src/js/vendor/**/*.*'])
        //     .pipe(gulp.dest('dist/js/vendor')),
        gulp.src(['src/images/*.*'])
            .pipe(gulp.dest('dist/images')),
        gulp.src(['src/*.*'])
            .pipe(gulp.dest('dist'))
    );
});

gulp.task('copy-html', function () {
    // Copy html files
    return es.concat(
        gulp.src(['src/**/*.html'])
            .pipe(gulp.dest('dist'))
    );
});

gulp.task('scripts', function () {
    return es.concat(
        // Concatenate, minify and copy all JavaScript (except vendor scripts)
        gulp.src(['src/js/app.js', 'src/js/plugins.js','!src/js/vendor/**'])
            .pipe(concat('app.js'))
            // .pipe(uglify())
            .pipe(gulp.dest('dist/js')),

        gulp.src(['src/js/vendor/jquery-3.1.1.min.js',
                  'src/js/vendor/jquery-ui.min.js',
                  'src/js/vendor/handlebars.js'])
            .pipe(concat('lib.js'))
            .pipe(gulp.dest('dist/js/vendor'))
    );
});

gulp.task('styles', function () {
    // Compile LESS files
    return gulp.src('src/less/app.less')
        .pipe(less())
        .pipe(rename('app.css'))
        .pipe(csso())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('server', function () {
    // Create a HTTP server for static files
    var port = 3000;
    var app = express();
    var server = http.createServer(app);

    app.use(express.static(__dirname + '/dist'));

    server.on('listening', function () {
        console.log('Listening on http://locahost:' + server.address().port);
    });

    server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(function () {
                server.listen(port);
            }, 1000);
        }
    });

    server.listen(port);
});

gulp.task('watch', function () {
    // Watch .js files and run tasks if they change
    gulp.watch('src/js/**/*.js', ['scripts']);

    // Watch .less files and run tasks if they change
    gulp.watch('src/less/**/*.less', ['styles']);

    gulp.watch('src/**/*.html', ['copy-html']);
});

// The dist task (used to store all files that will go to the server)
gulp.task('dist', ['clean', 'copy', 'scripts', 'styles']);

// The default task (called when you run `gulp`)
// gulp.task('default', ['clean', 'copy', 'scripts', 'styles', 'server', 'watch']);

gulp.task('default', ['dist'], function () {
    gulp.start('server');
    gulp.start('watch');
});
