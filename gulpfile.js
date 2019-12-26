const gulp = require('gulp');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const package = require('./package.json');
 
const cleanDist = async () => {
    await gulp.src('./dist', {read: false, allowEmpty: true})
    .pipe(clean());
};

const build = async () => {
    await gulp.src([
        './**/*', 
        '!./test/**', 
        '!./dist/**',
        '!./.gitignore',
        '!gulpfile.js',
        '!README.md',
        '!./.vscode/**',
    ])
    .pipe(zip(`${package.name}_${package.version}.zip`))
    .pipe(gulp.dest('dist'));
};

module.exports.clean = cleanDist;

module.exports.build = build;