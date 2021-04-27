# exia

在终端运行的一些常用功能的集合

## version

更新版本号

检查 git 提交 => 升级 package.json 版本号 => git push => 添加 git tag

```
Options:
  --custom-version <version>         更新指定版本到 package.json
  --no-gitcheck                      不检查 git 状态
  -p, --prereleaseId [prereleaseId]  发布/更新预发布版本：beta, alpha, RC ... (default: "beta")
  --no-tag                           是否添加 git tag
```

## publish

发布 npm 包

检查 git 提交 => 升级 package.json 版本号 => git push => 添加 git tag => npm publish

```
Options:
  --custom-version <version>         更新指定版本到 package.json
  --no-gitcheck                      不检查 git 状态
  -p, --prereleaseId [prereleaseId]  发布/更新预发布版本：beta, alpha, RC ... (default: "beta")
  --no-tag                           是否添加 git tag
```

## commit

TODO
