const gulp = require('gulp');
const paths = {
    data: './src/data/*'
}

gulp.src(paths.data)
    .pipe(gulp.dest('./dist/data/'))
