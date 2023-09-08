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
import figlet from "figlet";

// 项目中导入
import {
  installNodeModules,
  addDynamicTemplate,
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
          homepage,
          cssStyle,
          ui,
        } = res;

        const beginTime = new Date().getTime();
        const packagePath = path.join(projectPath, "package.json");
        const repository = {
            type: "git",
            url: `${homepage}.git`,
          },
          bugs = {
            url: `${homepage}/issues`,
          };

        // 模版下载
        const loading = ora(chalk.green.bold("template downloading..."));
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
              addDynamicTemplate(currentDirectory, projectPath);
            }
            if (ui) {
              const currentDirectory = path.join(templatePath, "ui", `${ui}`);
              addDynamicTemplate(currentDirectory, projectPath);
            }

            const time = (new Date().getTime() - beginTime) / 1000;

            console.log(
              chalk.bold(
                figlet.textSync("YJ VUE CLI", {
                  font: "Star Wars",
                  horizontalLayout: "default",
                  verticalLayout: "default",
                  width: 100,
                  whitespaceBreak: true,
                })
              )
            );

            console.log(
              chalk.green(
                `\n 🌟🌟🌟download project template finish in ${time}s.\n`
              )
            );

            // 项目创建完成之后 依赖包选择
            installNodeModules(projectPath);
          } else {
            loading.stop();
            console.error(err);
          }
        });
      });
    });
  program.parse(process.argv);
};
