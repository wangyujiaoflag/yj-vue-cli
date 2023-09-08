import chalk from "chalk";
import { exec } from "child_process";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";

import deepMerge from "./deepMerge.js";
import { CopyDirToSrc } from "./dirCopy.js";

// 下载项目依赖包
export const InstallNodeModules = (projectPath) => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "isAutoInstall",
        message: "是否需要脚手架自动下载依赖",
        default: true,
      },
    ])
    .then(({ isAutoInstall }) => {
      if (isAutoInstall) {
        inquirer
          .prompt([
            {
              type: "list",
              name: "packageManage",
              default: "npm",
              choices: ["npm", "pnpm", "yarn"],
            },
          ])
          .then(({ packageManage }) => {
            const projectInstall = ora(
              `start use ${packageManage} to install...`
            );
            const command =
              packageManage === "yarn" ? "yarn" : `${packageManage} install`;
            projectInstall.start();

            exec(command, { cwd: projectPath }, (error, stdout, stderr) => {
              if (error) {
                console.error(`执行的错误: ${error}`);
                return;
              }
              if (stdout) {
                console.log(`\n${stdout}`);
              }
              if (stderr) {
                console.error(`stderr2: ${stderr}`);
              }

              projectInstall.succeed();

              console.log(chalk.green("正在为您打开项目"));
              exec(`code ${projectPath}`);
            });
          });
      }
    });
};

// TODO: 不太灵活，不完美，很受限制，不易拓展
// 动态更新模版  需要注意文件的读写操作是异步的！！！
export const AddDynamicTemplate = (currentDirectory, projectPath, type) => {
  // 读取当前目录下的所有文件
  fs.readdir(currentDirectory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // 当前已创建项目的路径及资源
    const packagePath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath).toString());

    // 遍历文件数组
    files.forEach((file) => {
      // 获取文件的完整路径
      const filePath = path.join(currentDirectory, file);

      // 如果是文件
      if (fs.statSync(filePath).isFile()) {
        // package.json
        if (filePath.includes("package.json")) {
          const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));
          deepMerge(packageJson, pkg);
          fs.writeFileSync(
            packagePath,
            JSON.stringify(packageJson, null, "\t")
          );
        } else if (filePath.includes("main.ts")) {
        } else {
          const targetPath = path.join(`${projectPath}`, "src", file);
          const fileData = fs.readFileSync(filePath, "utf8");
          fs.writeFileSync(targetPath, fileData, "utf8");
        }
      } else {
        // 写到项目src同名目录下
        CopyDirToSrc(file, path.join(projectPath, "src"));
      }
    });
  });
};

// 动态问答配置
export const question = [
  {
    type: "input",
    message: "项目描述",
    name: "description",
    default: "",
  },
  {
    type: "input",
    message: "git仓库名称",
    name: "repositoryName",
    default: "",
  },
  {
    type: "list",
    name: "ui",
    message: "UI 库选择：",
    default: "antd",
    choices: [
      {
        name: "antd",
        value: "antd",
      },
      {
        name: "elementui",
        value: "elementui",
      },
    ],
  },
  {
    type: "list",
    name: "cssStyle",
    message: "样式库选择：",
    default: "less",
    choices: [
      {
        name: "less",
        value: "less",
      },
      {
        name: "sass",
        value: "sass",
      },
    ],
  },
  // {
  //   type: "list",
  //   name: "store",
  //   default: "pinia",
  //   message: "vue状态管理：",
  //   choices: [
  //     {
  //       name: "vuex",
  //       value: "vuex",
  //     },
  //     {
  //       name: "pinia",
  //       value: "pinia",
  //     },
  //   ],
  // },
  // {
  //   type: "confirm",
  //   name: "ts",
  //   message: "是否启用typescript",
  //   default: true,
  // },
  // {
  //   type: "confirm",
  //   name: "router",
  //   message: "是否启用vue-router",
  //   default: true,
  // },
];

// package.json基本信息
// export const InitProjectBaseInfo = (projectName, projectPath) => {
//   inquirer
//     .prompt([
//       {
//         message: "项目描述",
//         name: "description",
//         default: "",
//       },
//       {
//         message: "仓库名称",
//         name: "repositoryName",
//         default: "待填写",
//       },
//     ])
//     .then(({ description, repositoryName }) => {
//       const packagePath = path.join(projectPath, "package.json");
//       const packageJson = JSON.parse(fs.readFileSync(packagePath).toString());

//       const repository = {
//           type: "git",
//           url: `git+https://github.com/wangyujiaoflag/${repositoryName}.git`,
//         },
//         homepage = `https://github.com/wangyujiaoflag/${repositoryName}`,
//         bugs = {
//           url: `https://github.com/wangyujiaoflag/${repositoryName}/issues`,
//         },
//         author = {
//           name: "wangyujiaoflag",
//           url: "https://github.com/wangyujiaoflag",
//         };

//       Object.assign(packageJson, {
//         name: projectName,
//         description,
//         repository,
//         homepage,
//         bugs,
//         author,
//       });

//       fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, "\t"));
//     });
// };
