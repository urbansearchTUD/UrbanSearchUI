const gulp = require('gulp');
const paths = {
    data: './src/index.html'
}

gulp.src(paths.data)
    .pipe(gulp.dest('./dist/'))
