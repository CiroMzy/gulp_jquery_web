# 中澜-前端

# gulp文件修改

1.更改gulp-rev文件(version:"8.1.0")
node_modules--->gulp-rev--->index.js
将 manifest[originalFile] = revisionedFile;
改为 manifest[originalFile] = originalFile + '?v=' + file.revHash;
2更改gulp-rev-collector文件(version:"1.2.3")
node_modules--->gulp-rev-collector--->index.js

将 let cleanReplacement = path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );

改为 let cleanReplacement =  path.basename(json[key]).split('?')[0];
