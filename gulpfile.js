const  {src, dest, watch, parallel } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const { reload } = require('browser-sync');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const imagemin = require ( 'gulp-imagemin' );
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
exports.build = build;
exports.images = images

exports.default = parallel(scripts, browsersync, watching)
