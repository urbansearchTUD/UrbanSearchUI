const gulp = require('gulp');
const paths = {
    data: './static/*'
}

gulp.src(paths.data)
    .pipe(gulp.dest('./dist/static/'))
