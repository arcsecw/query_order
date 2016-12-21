

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import autoprefixer from 'autoprefixer';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const isProduction = process.env.NODE_ENV === 'production';

const AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3',
  'bb >= 10'
];

const paths = {
  dist: {
    base: 'dist',
    js: 'dist/js',
    css: 'dist/css',
    i: 'dist/i',
    fonts: 'dist/fonts'
  }
};


// 图片优化
gulp.task('images', function() {
  return gulp.src('app/i/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(paths.dist.i))
    .pipe($.size({title: 'images'}));
});

// 拷贝相关资源
gulp.task('copy', function() {
  return gulp.src([
    'app/*',
    '!app/*.html',
    '!app/js',
    '!app/less',
    '!app/i',
    'node_modules/amazeui/dist/css/amazeui.min.css',
    'node_modules/amazeui/dist/fonts/*'
  ], {
    dot: true
  }).pipe(gulp.dest(function(file) {
      var filePath = file.path.toLowerCase();
      if (filePath.indexOf('.css') > -1) {
        return paths.dist.css;
      } else if (filePath.indexOf('fontawesome') > -1) {
        return paths.dist.fonts;
      }
      return paths.dist.base;
    }))
    .pipe($.size({title: 'copy'}));
});

// 编译 Less，添加浏览器前缀
gulp.task('styles', function() {
  return gulp.src(['app/less/app.less'])
    .pipe($.less())
    .pipe($.postcss([autoprefixer({browsers: AUTOPREFIXER_BROWSERS})]))
    .pipe(gulp.dest('dist/css'))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({title: 'styles'}));
});

// 打包 Common JS 模块
var b = browserify({
  cache: {},
  packageCache: {},
  entries: ['./app/js/app.js'],
  debug: !isProduction,
  transform: ['babelify']
});

if (!isProduction) {
  b = watchify(b);
}

// 如果不想把 React 打包进去，可以把下面一行注释去掉
// b.transform('browserify-shim', {global: true});

var bundle = function() {
  const s = (
    b.bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest(paths.dist.js))
      .pipe($.size({title: 'script'}))
  );

  return !isProduction ? s : s.pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist.js))
    .pipe($.size({
      title: 'script minify'
    }));
};

gulp.task('browserify', function() {
  if (!isProduction) {
    b.on('update', bundle).on('log', $.util.log);
  }

  return bundle();
});

// 压缩 HTML
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe($.minifyHtml())
    .pipe($.replace(/\{\{__VERSION__\}\}/g, isProduction ? '.min' : ''))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// 洗刷刷
gulp.task('clean', function() {
  return del(['dist/*', '!dist/.git'], {dot: true});
});

// 构建任务
gulp.task('build', function(cb) {
  runSequence('clean', ['styles', 'html', 'images', 'copy', 'browserify'], cb);
});

// 监视源文件变化自动cd编译
gulp.task('watch', function() {
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/less/**/*less', ['styles']);
  gulp.watch('app/i/**/*', ['images']);
});

// 默认任务
// 启动预览服务，并监视 Dist 目录变化自动刷新浏览器
gulp.task('default', ['build', 'watch'], function() {
  browserSync({
    notify: false,
    logPrefix: 'ASK',
    server: 'dist'
  });

  gulp.watch(['dist/**/*'], reload);
});
