const { src, dest, watch, parallel } = require('gulp');

//css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//img
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css( done ){
    src('src/scss/**/*.scss') //Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init()) //Inicia sourcemaps ya con la hoja de estilos a compilar
        .pipe( plumber() )
        .pipe( sass() ) //Compilarlo
        .pipe( postcss([autoprefixer(), cssnano()]) ) //Minificar css
        .pipe(sourcemaps.write('.') ) //Guardar en la misma ubicacion que el css
        .pipe( dest('build/css') ) //Almacenarlo en local
    done();
}

function imagenes( done ){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin( opciones ) ) )
        .pipe( dest('build/img') )
    done();
}

function imgToWebp( done ){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
    done();
}

function imgToAvif( done ){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
    done();
}

function js( done ){
    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/js'))
    done();
}

function dev( done ){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);
    done();
}
exports.css = css;
exports.js = js;
exports.imagenes = imagenes;
exports.imgToWebp = imgToWebp;
exports.imgToAvif = imgToAvif;
exports.dev = parallel(imagenes, imgToWebp, imgToAvif, js, dev);