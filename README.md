

# gulp处理功能简介

## 1:可以实现不同模块的引用

## 2:对es6进行转译

## 3:对less进行编译

## 4:编译之后添加版本号，处理缓存

## 5:自动添加css的前缀

# 项目最终状态简介

## 1:项目对标的是vue/react这类的框架，通过jquery+gulp，达到类似的状态。

## 2:将创建dom这部分提出到createDom.js文件集中处理，并利用es6的转译符`${}`，来达到一个变异js模版的状态。

## 3:创建一个router对象，并将页面信息配置到对象中，用来配置不同页面的特殊配制信息，如标题等。类似于 vue的router的概念

## 4:每个模块中直接处理改模块的事件/方法，达到一个统一处理的目的。如titleBar.html中，可以统一处理标题，返回键的操作等

## 5:通过gulp对less的编译，达到可以使用less的状态

## 6:通过gulp对创建对文件添加版本信息，用来处理微信缓存对问题。

## 7:页面编译完成之后，将js/css/html打包出来。图片，第三方插件等不做处理，达到所有内容都在dist文件中的状态



```
# gulp文件修改

1.更改gulp-rev文件(version:"8.1.0")
node_modules--->gulp-rev--->index.js
将 manifest[originalFile] = revisionedFile;
改为 manifest[originalFile] = originalFile + '?v=' + file.revHash;
2更改gulp-rev-collector文件(version:"1.2.3")
node_modules--->gulp-rev-collector--->index.js
将 let cleanReplacement = path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
改为 let cleanReplacement =  path.basename(json[key]).split('?')[0];

```
