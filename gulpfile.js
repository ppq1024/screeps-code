var typedoc = require('gulp-typedoc');
var gulp = require('gulp');

gulp.task('typedoc', () => 
    gulp.src(['src/**/*.ts'])
        .pipe(typedoc({
            out: 'doc/',
            name: 'unnamed'
        }))
)