const gulp = require('gulp');
const paths = {
    img: './static/img/*'
}

gulp.src(paths.img)
    .pipe(gulp.dest('./dist/img/'))
