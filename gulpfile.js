let gulp = require('gulp')
var rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence');
var connect = require('gulp-connect');
let fileinclude = require('gulp-file-include')
var autoprefixer = require('gulp-autoprefixer')
let less = require('gulp-less')
let clean = require('gulp-clean')
let livereload = require('gulp-livereload')
let babel = require('gulp-babel')

gulp.task('webserver',function(){
    connect.server({
        port:2333
    });
});



// 模版文件合并
gulp.task('fileinclude', function () {
    return gulp.src('./src/pages/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'))
})

// 清除文件
gulp.task('cleanHtml', function () {
    return gulp.src('./dist/**/*.html', {read: false})
        .pipe(clean())
})
gulp.task('cleanCss', function () {
    return gulp.src('./dist/css/*.css', {read: false})
        .pipe(clean())
})
gulp.task('cleanJs', function () {
    return gulp.src('./dist/js/*.js', {read: false})
        .pipe(clean())
})

gulp.task('compileLess', function () {
    return gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 20 versions']
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/css'))
})
gulp.task('babel', function () {
    return gulp.src(['./src/js/*.js'])
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload())
})

//CSS文件生成版本号(hash编码),并将所有带有版本号的文件放入rev-manifest.json中
gulp.task('revCss', function(){         //gulp.task--定义一个gulp任务；revCSS--定义该任务的名称，起任何名称都可以
    return gulp.src('dist/css/*.css')        //gulp.src--要操作的源文件路径
        .pipe(rev())                    //定义一个流，将所有匹配到的文件名全部生成相应的版本号
        .pipe(rev.manifest())           //把所有生成的带版本号的文件名保存到json文件中
        .pipe(gulp.dest('dist/css'));    //把json文件保存到指定的路径，即src下面的css文件，没有该文件，会自动创建
});
gulp.task('watch', function(){
    gulp.watch('./src/**', ['default']);
});
//CSS文件生成版本号,并将所有带有版本号的文件放入json中
gulp.task('revJs', function(){
    return gulp.src('src/js/*.js')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

//将html文件中的css,js文件引入路径全部替换成带有版本号的
gulp.task('revHtml', function () {
    return gulp.src(['dist/**/*.json', 'dist/*.html'])   //gulp.src--第一个参数：生成的json文件的路径，我这里将所有的json文件，js和css,都选中；第二个参数：要替换css,js文件(路径)的HTML文件
        .pipe(revCollector())
        .pipe(gulp.dest('./dist'));       //html更换css,js文件版本，更改完成之后保存的地址
});

//开发构建
gulp.task('default', function (done) {
    condition = false;
    runSequence(       //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        ['cleanHtml'],
        ['cleanCss'],
        ['cleanJs'],
        ['compileLess'],
        ['babel'],
        ['fileinclude'],
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        ['watch'],
        done);
});
