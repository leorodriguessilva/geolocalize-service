const gulp = require('gulp');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const install = require('gulp-install');
const webpack = require('webpack-stream');
const package = require('./package.json');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
 
const cleanDist = async () => {
    await gulp.src('./dist', {read: false, allowEmpty: true})
    .pipe(clean());
};

const cleanBuild = async () => {
    await gulp.src([
        './tmp',
    ], {read: false, allowEmpty: true})
    .pipe(clean().on('error', (err) => {
        console.log(err);
    }));
};

const buildSrc = async () => {
    await gulp.src([
        './src/**/*',
    ])
    .pipe(gulp.dest('tmp'));
};

const transpile = async () => {
    await gulp.src('./tmp/Main.js')
    .pipe(webpack({
        target: 'node',
        entry: './tmp/Main.js',
        output: {
          filename: 'geolocalize-function.js',
        },
        externals: nodeModules,
        mode: 'production',
      }))
    .pipe(gulp.src('./package*.json'))
    .pipe(gulp.dest('tmp/compiled/'));
};

const buildDeps = async () => {
    await gulp.src([
        './package.json',
    ])
    .pipe(gulp.dest('tmp'))
    .pipe(install({production: true}));
};

const zipFiles = async () => {
    await gulp.src([
        './tmp/compiled/**'
    ])
    .pipe(zip(`${package.name}_${package.version}.zip`))
    .pipe(gulp.dest('dist'));
};

module.exports.clean = cleanDist;

module.exports.cleanBuild = cleanBuild;

module.exports.build = buildSrc;

module.exports.transpile = transpile;

module.exports.buildDeps = buildDeps;

module.exports.package = zipFiles;