const { src, dest, series, watch } = require('gulp');

const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const cleanCss = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'))
const del = require('del');


const scssCompileDev = () => {
	return src('src/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(concat('main.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(dest('dist'))
		.pipe(browserSync.stream())
}

const htmlMinifyDev = () => {
	return src('src/**/*.html')
		.pipe(dest('dist'))
		.pipe(browserSync.stream());
}

const scssCompileBuild = () => {
	return src('src/styles/**/*.scss')
		.pipe(concat('main.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPrefixer({
			cascade: false,
		}))
		.pipe(cleanCss({
			level: 2
		}))
		.pipe(dest('dist'))
}

const htmlMinifyBuild = () => {
	return src('src/**/*.html')
		.pipe(htmlMin({
			collapseWhitespace: true,
		}))
		.pipe(dest('dist'))
}

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: 'dist',
		}
	})
}

const clean = () => {
	return del(['dist'])
}

const svgSprites = () => {
	return src('src/images/svg/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('dist/images'))
}

const imagesPrep = () => {
	return src(['src/images/**/*.jpg',
		'src/images/**/*.png',
		'src/images/**/*.svg',
		'src/images/**/*.jpeg'])
		.pipe(image())
		.pipe(dest('dist/images'))
}


watch('src/**/*.html', htmlMinifyDev);
watch('src/images/svg/**/*.svg', svgSprites);
watch(['src/images/**/*.jpg',
	'src/images/**/*.png',
	'src/images/**/*.svg',
	'src/images/**/*.jpeg'], imagesPrep);
watch('src/styles/**/*.scss', scssCompileDev);

const dev = series(clean, htmlMinifyDev, scssCompileDev, svgSprites, imagesPrep, watchFiles);
exports.dev = dev;

const build = series(clean, htmlMinifyBuild, scssCompileBuild, svgSprites, imagesPrep);
exports.build = build;