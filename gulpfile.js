var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var path = {
    sassSource: 'src/scss/**/*.scss',
    sassOutput: 'src/css',
    cssCleanSource: 'src/css/**/*.css',
    cssCleanOutput: 'dist/css',
    uglifySource: 'src/js/**/*.js',
    uglifyOutput: 'dist/js',
    imgSource: 'src/img/**/*.{jpg,jpeg,png,gif}',
    imgOutput: 'dist/img',
    htmlSource: 'src/*.html',
    htmlOutput: 'dist/',
    dist: 'dist'
}

gulp.task('reload', function () {
    browserSync.reload();
});


gulp.task('serve', ['sass'], function () {
    browserSync({
        server: 'src'
    });

    gulp.watch('src/*.html', ['reload']);
    gulp.watch(path.sassSource, ['sass']);

});
gulp.task('sass', function () {
    return gulp.src(path.sassSource)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.sassOutput))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    return gulp.src(path.cssCleanSource)
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.cssCleanOutput))
});

gulp.task('js', function () {
    return gulp.src(path.uglifySource)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.uglifyOutput))
});

gulp.task('img', function() {
    return gulp.src(path.imgSource)
        .pipe(changed(path.imgOutput))
        .pipe(imagemin())
        .pipe(gulp.dest(path.imgOutput));
});

gulp.task('html', function() {
    return gulp.src(path.htmlSource)
        .pipe(htmlreplace({
            'css': 'css/style.css',
            'js': 'js/script.js'
        }))
        .pipe(htmlmin({
            sortAttribute:true,
            sortClassName:true,
            collapseWhitespace:true
        }))
        .pipe(gulp.dest(path.htmlOutput));
});

gulp.task('clean', function() {
    return del([path.dist]);
});

gulp.task('build',function(){
    sequence('clean', ['html','js','css','img']);
});

gulp.task('default', ['serve']);