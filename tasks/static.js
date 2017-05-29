const gulp = require('gulp');
const paths = {
    data: './src/static/*'
}

gulp.src(paths.data)
    .pipe(gulp.dest('./dist/static/'))
