const gulp = require('gulp');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const install = require('gulp-install');
const package = require('./package.json');
 
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

const buildDeps = async () => {
    await gulp.src([
        './package.json',
    ])
    .pipe(gulp.dest('tmp'))
    .pipe(install({production: true}));
};

const zipFiles = async () => {
    await gulp.src([
        './tmp/**'
    ])
    .pipe(zip(`${package.name}_${package.version}.zip`))
    .pipe(gulp.dest('dist'));
};

module.exports.clean = cleanDist;

module.exports.cleanBuild = cleanBuild;

module.exports.build = buildSrc;

module.exports.buildDeps = buildDeps;

module.exports.package = zipFiles;