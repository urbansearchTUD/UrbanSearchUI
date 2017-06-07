const gulp = require('gulp');
const concat = require('gulp-concat');
const paths = {
    css: './src/**/*.css'
}

gulp.src(paths.css)
    .pipe(concat('index.css'))
    .pipe(gulp.dest('./dist/css/'))
