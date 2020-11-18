let gulp = require('gulp'),
	sass = require('gulp-sass');

const paths = {
	styles: {
		src: 'app/scss/**/*.scss',
		dest: 'app/css'
	},
	scripts: {
		src: 'app/main/**/*.js',
		dest: 'assets/scripts/'
	}
	};


gulp.task('scss', function (){
	return gulp.src(paths.styles.src)
		.pipe(sass({outputStyle: 'expanded'})) /* 'compressed' */
		.pipe(gulp.dest(paths.styles.dest)
});
gulp.task('watch', function(){
	gulp.watch(paths.styles.src, gulp.parallel('scss'))
})