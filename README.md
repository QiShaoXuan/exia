# exia

在终端运行的一些常用功能的集合

## 使用

```shell script
npm i exia -g

exia <command> [options]
```

## version

更新版本号

检查 git 提交 => 升级 package.json 版本号 => git push => 添加 git tag

```
Options:
  --custom-version <version>         自定义版本号
  --no-gitcheck                      不检查 git 状态
  -p, --prereleaseId [prereleaseId]  自定义预发版本前缀：beta, alpha, RC ... (default: "beta")
  --no-tag                           不添加 git tag
  -h, --help                         display help for command
```
