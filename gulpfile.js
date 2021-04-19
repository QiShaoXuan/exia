const { src, dest, series, watch } = require('gulp');
const gulpTypescript = require('gulp-typescript');
const del = require('del');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const cache = require('gulp-cached');
const remember = require('gulp-remember');


function buildTs() {
  const tsProject = gulpTypescript.createProject('./tsconfig.json');

  return src(`./src/**/*.ts`)
    .pipe(cache('build-ts'))
    .pipe(tsProject())
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace('./src', './lib');
      }),
    )
    .pipe(remember('build-ts'))
    .pipe(dest(`./lib`));
}

function moveJSON() {
  return src('./src/**/*.json').pipe(dest('./lib'));
}

function moveJS() {
  return src('./src/**/*.js').pipe(dest('./lib'));
}

function clean(cb) {
  del('./lib').then(() => cb());
}

function buildPackages() {
  return series(buildTs, moveJSON, moveJS);
}

function lint() {
  return src('./src/**/*.ts')
    .pipe(cache('linting'))
    .pipe(
      eslint({
        quiet: false,
        fix: true,
      }),
    )
    .pipe(eslint.format())
    .pipe(remember('linting'))
    .pipe(eslint.failAfterError());
}

function watchTask() {
  watch('./src/**/*.ts', series(lint));
  watch('./src/**/*.ts', series(buildTs));
  watch('./src/**/*.json', series(moveJSON));
  watch('./src/**/*.js', series(moveJS));
}

exports.default = series(clean, buildPackages(), lint, watchTask);
exports.clean = clean;
exports.build = series(clean, buildPackages(), lint);
exports.lint = lint;
