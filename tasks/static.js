const gulp = require('gulp');
const paths = {
    img: './static/*/*'
}

gulp.src(paths.img)
    .pipe(gulp.dest('./dist/'))
