// node内置模块
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// 需要安装的
import { program } from "commander";
import inquirer from "inquirer";
import download from "download-git-repo";
import chalk from "chalk";
import ora from "ora";

// 项目中导入
import {
  InstallNodeModules,
  AddDynamicTemplate,
  question,
} from "../utils/baseAction.js";

export default () => {
  program.version("1.0.0");

  // 注册create命令，name作为参数 指项目名
  program
    .command("create <name>")
    .description("create a vue project")
    .action((name) => {
      const projectPath = path.join(process.cwd(), name);

      // 获取一些项目信息
      inquirer.prompt(question).then((res) => {
        const {
          // store, router, ts,
          description,
          repositoryName = name,
          cssStyle,
          ui,
        } = res;

        const beginTime = new Date().getTime();
        const packagePath = path.join(projectPath, "package.json");
        const repository = {
            type: "git",
            url: `git+https://github.com/wangyujiaoflag/${repositoryName}.git`,
          },
          homepage = `https://github.com/wangyujiaoflag/${repositoryName}`,
          bugs = {
            url: `https://github.com/wangyujiaoflag/${repositoryName}/issues`,
          },
          author = {
            name: "wangyujiaoflag",
            url: "https://github.com/wangyujiaoflag",
          };

        // 模版下载
        const loading = ora("template downloading...");
        loading.start();
        download(`wangyujiaoflag/vue3-template`, projectPath, async (err) => {
          if (!err) {
            loading.succeed();

            // 读取package.json文件
            const packageJson = JSON.parse(
              fs.readFileSync(packagePath).toString()
            );
            Object.assign(packageJson, {
              name,
              description,
              repository,
              homepage,
              bugs,
              author,
            });

            fs.writeFileSync(
              packagePath,
              JSON.stringify(packageJson, null, "\t")
            );

            // 动态配置 获取脚手架的目录
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(dirname(__filename));

            const templatePath = path.join(__dirname, "template");
            if (cssStyle) {
              const currentDirectory = path.join(
                templatePath,
                "cssStyle",
                `${cssStyle}`
              );
              AddDynamicTemplate(currentDirectory, projectPath);
            }
            if (ui) {
              const currentDirectory = path.join(templatePath, "ui", `${ui}`);
              AddDynamicTemplate(currentDirectory, projectPath);
            }

            const time = (new Date().getTime() - beginTime) / 1000;
            console.log(
              chalk.green(`\ndownload project template finish in ${time}s`)
            );

            // 项目创建完成之后 依赖包选择
            InstallNodeModules(projectPath);
          } else {
            loading.stop();
            console.error(err);
          }
        });
      });
    });
  program.parse(process.argv);
};
