const gulp = require('gulp');
const paths = {
    data: './data/*'
}

gulp.src(paths.data)
    .pipe(gulp.dest('./dist/data/'))
