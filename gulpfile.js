const gulp = require('gulp');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
 
exports.clean = () => (
    gulp.src('./dist', {read: false})
    .pipe(clean())
);

exports.default = () => (
    gulp.src([
        '!./test', 
        '!./dist',
        '!./.gitignore',
        '!./.gulpfile.js',
        '!./README.md',
        '!.vscode/',
        './**/*', 
    ])
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'))
);