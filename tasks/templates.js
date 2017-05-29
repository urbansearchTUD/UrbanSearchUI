const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');

const paths = {
    templates: './src/**/*.html'
}

gulp.src(paths.templates)
    .pipe(nunjucks.precompile())
    .pipe(gulp.dest(function (file) {
        return file.base;
    }));
