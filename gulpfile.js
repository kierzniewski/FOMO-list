var gulp = require('gulp');
var sass = require('gulp-sass');

//var sftp = require('gulp-sftp');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');


//Watching scss/ html file
gulp.task('watch', function() {
    gulp.watch('./scss/**/*.scss', ['sass']);
});



gulp.task('sass', function() { // funkcja callback
    return gulp.src('./scss/**/*.scss') //-->zrodlo
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole:true}))
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css')) // --> gdzie laduja
})




gulp.task('default', ['sass', 'watch']);