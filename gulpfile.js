let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

const paths = {
    styles: {
        src: 'app/scss/**/*.scss',
        dest: 'app/css'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'app/js'
    },
    html: {
        src: 'app/*.html',
    },
};

gulp.task('html', function() {
    return gulp.src(paths.html.src)
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('script', function() {
    return gulp.src(paths.html.src)
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('scss', function() {
    return gulp.src(paths.styles.src)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({ suffix: '.min' })) /* 'expanded' */
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function() {
    return gulp.src([
            'node_modules/slick-carousel/slick/slick.js',
            'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
});

gulp.task('watch', function() {
    gulp.watch(paths.styles.src, gulp.parallel('scss'));
    gulp.watch(paths.html.src, gulp.parallel('html'));
    gulp.watch(paths.scripts.src, gulp.parallel('script'));
})

gulp.task('default', gulp.parallel('scss', 'js', 'browser-sync', 'watch'));