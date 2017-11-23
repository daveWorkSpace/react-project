const [gulp, concat, replace, clean, rename, package, config] = [
  require('gulp'),
  require('gulp-concat'),
  require('gulp-replace'),
  require('gulp-clean'),
  require('gulp-rename'),
  require('./package.json'),
  require('./config'),
];

const dist = './dist/';

gulp.task('static', () => {
  // 静态文件
  gulp.src('./src/static/*.ico')
    .pipe(gulp.dest('./dist/static'));
});

gulp.task('changeVersion', () => {
  //改版html本号
  gulp.src([`${dist}index.html`])
    .pipe(replace('.js?version', `.${package.version}.js`))
    .pipe(replace('.css?version', `.${package.version}.css`))
    .pipe(gulp.dest('./dist/'));

  //改版文件
  gulp.src([`${dist}index.css`, `${dist}index.js`])
    .pipe(rename({
      dirname: '',
      suffix: `.${package.version}`,
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('cleanScripts', () => {
  //清除chunk文件
  gulp.src([`${dist}index.css`, `${dist}index.js`], { read: false })
    .pipe(clean());
});
