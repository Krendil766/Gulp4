const  {src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const { reload } = require('browser-sync');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');
/*const autoprefixer = require('gulp-autoprefixer'); */

function styles (){
	return src('app/scss/style.scss')
			.pipe(scss({outputStyle:'compressed'}))
			.pipe(concat('style.min.css'))
/* 			.pipe(autoprefixer({
				overrideBrowserlist: ['last 10 version'],
				grid: true
			})) */
			.pipe(dest('app/css'))
			.pipe(browserSync.stream());
}

function browsersync(){
	browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function scripts (){
	return src([
		'node_modules/jquery/dist/jquery.js',
		'app/js/main.js'
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js/'))
		.pipe(browserSync.stream());
}

function images(){
	return src('app/images/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(dest('dist/images'))
	}

function cleanDist(){
	return del('dist')
}

function build(){
	return src ([
		'app/css/style.min.css',
		'app/js/main.min.js',
		'app/**/*.html',
		'app/fonts/**/*'
	], {base: 'app'})
	.pipe(dest('dist'))
}

function watching (){
	watch(['app/scss/**/*.scss'], styles)
	watch(['app/js/main.js', '!app/js/main.min.js'], scripts)
	watch(["app/**/*.html"]).on('change', browserSync.reload)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, /* images, */ build )
exports.default = parallel(styles, scripts, browsersync, watching);
