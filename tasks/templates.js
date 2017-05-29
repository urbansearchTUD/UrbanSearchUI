const gulp = require('gulp');
const concat = require('gulp-concat');
const nunjucks = require('gulp-nunjucks');
const rename = require("gulp-rename");

const paths = {
    templates: './src/**/*.html'
}

gulp.src(paths.templates)
    .pipe(nunjucks.precompile())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./dist'));
