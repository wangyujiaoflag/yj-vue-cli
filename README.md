# yj-vue-cli

cli（command-line-interface）

## 项目构成：VITE + VUE3 + TypeScript + VueRouter + Pinia + ANTD + LESS

## 使用

```bash
# 下载脚手架
npm install yj-vue-cli
# 创建项目
yj create project-name
# 运行项目
npm run dev
```

## 目标

适用于项目

- ✅ 实现简单脚手架 🔧
- ⏳ 基于 vue 脚手架进一步封装 📦

## 需求

- 集成组件库、CSS，模版单独维护，默认有 VITE + VUE3 + TypeScript + VueRouter + Pinia
  - [模板地址 vue3-template](https://github.com/wangyujiaoflag/vue3-template)
- 默认当前文件夹不存在，可以直接创建

- **脚手架流程**
  - yj create xxx
  - 确定当前文件夹是否存在，存在的话是覆盖还是继续创建？❌
  - 选择配置
  - 下载模版
  - 是否需要自动下载依赖
  - 工具选择 npm、pnpm、yarn ⌛️：只完善了 npm
  - 下载项目依赖
  - 打开目录
- **脚手架配置**：
  - 交互式：
    - UI 库：ElementUI、ANTD
    - CSS 处理器：LESS、SASS
    - 项目描述
    - 仓库名称
- **模版配置**：⏳
  - eslint：eslint-config-jtyk
  - prettier
  - stylelint
  - commitlint

## 实现

```bash
# 创建目录
mkdir yj-vue-cli

# 进入目录
cd yj-vue-cli

# 初始化
npm init

# 安装工具库
## ---在脚手架构建中，可能会使用到的一些工具库包括---
## cross-spawn：用于跨平台 shell 工具。
## commander：用于自定义命令行指令。
## inquirer：用于命令行交互工具。
## chalk：用于命令行美化工具。
## ora：用于命令行加载动效。
## download-git-repo：模版下载
## postinstall：在包安装完成后执行相应的脚本
## @babel/core：这是Babel的核心包，用于配置Babel的转换过程。
## @babel/cli：这是Babel的命令行接口，用于执行Babel的转换命令。
## @babel/preset-env：这是Babel的环境预设，用于指定Babel要转换的语法和特性
npm install commander chalk inquirer ora download-git-repo @babel/core @babel/cli @babel/preset-env --save-dev

# 添加项目入口
## 入口：bin/index.js 写入 #!/usr/bin/env node
## package.json 添加bin

# es6模块开发 配置babel
## .babelrc配置
## package.json 添加 type: module

# 利用node api进行文件读写

# 创建完成之后的自动化
## child_process.exec(command, options?, callback) 用于在 Node.js 中执行 shell 命令

# 链接
npm link

# 执行命令
yj create xxx

# 发布到npm
npm publish

```

## 文档

- [自定义命令行指令 commander](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%E5%91%BD%E4%BB%A4%E5%8F%82%E6%95%B0)
- [命令行交互工具 inquirer](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md)
- [从 git 上下载模板 download-git-repo](https://www.npmjs.com/package/download-git-repo)
- [模板地址 vue3-template](https://github.com/wangyujiaoflag/vue3-template)
- [在包安装完成后执行相应的脚本 postinstall](https://www.npmjs.com/package/postinstall)

## TODO

- 模版地址怎么来的 ✅
- vscode 创建开发模版 ⏳
- 不同包管理器对应操作完善
- 获取脚手架所在的文件路径，从而进行拼接替换 ✅
- 拉 github 模版有时候会超时，体验感差
- nodejs 文件读写相关学习、process
- main.ts 差异化信息插入
- 动态配置插入模版相关文件补充 ⏳
