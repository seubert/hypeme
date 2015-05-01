/* gulpfile.js */
 
// Load some modules which are installed through NPM.
var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var reactify = require('reactify');  // Transforms React JSX to JS.
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');
var atomshell = require('gulp-atom-shell');
var less = require('gulp-less');
var path = require('path');
 
// Define some paths.
var paths = {
  css: ['./src/less/site.less'],
  app_jsx: ['./src/components/app.jsx'],
  jsx: ['./src/components/**/*.jsx'],
  html: ['./src/templates/*.html'],
  app: [
      './src/main.js',
      './src/hypem/**/*',
  ]
};
 
gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(less())
    .pipe(gulp.dest('build/css'))
});
 
gulp.task('js', function() {
  browserify(paths.app_js)
    .transform(reactify)
    .pipe(babel())
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/components'))
});

gulp.task('html', function() {
  return gulp.src(paths.html, {base: './src'})
    .pipe(gulp.dest('build'))
})

gulp.task('moveapp', function() {
  return gulp.src(paths.app, {base: './src'})
    .pipe(gulp.dest('build'))
    .pipe(livereload());
})

gulp.task('movepackage', function() {
  return gulp.src(['./package.json'])
    .pipe(gulp.dest('build'))
    .pipe(livereload())
})

gulp.task('movemodules', function() {
  return gulp.src(['./node_modules'])
    .pipe(gulp.dest('build'))
    .pipe(livereload())
})

gulp.task('movecrap', ['moveapp', 'movepackage', 'movemodules']);
 
gulp.task('watch', function() {
  gulp.watch(paths.jsx, ['js', 'movecrap']);
  gulp.watch(paths.html, ['html', 'movecrap']);
  gulp.watch(paths.css, ['css', 'movecrap']);
  gulp.watch(paths.app, ['movecrap']);
  gulp.watch('./package.json', ['movepackage'])
  livereload.listen();
});

gulp.task('build', function() {
  var files = [
    './build',
    './package.json',
  ];

  return gulp.src(files)
    .pipe(atomshell({
        version: '0.23.0',
        platform: 'win32'
      }))
    .pipe(atomshell.zfsdest('app.zip'))
})
 
gulp.task('default', ['watch', 'css', 'js', 'html', 'movecrap']);