import fs from "fs";
import path from "path";

export function CopyDirToSrc(sourceDir, targetDir) {
  // 获取源文件夹下的所有文件和文件夹
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    // 遍历所有文件和文件夹
    files.forEach((file) => {
      // 获取源文件或文件夹的完整路径
      const sourcePath = path.join(sourceDir, file);
      // 获取目标文件或文件夹的完整路径
      const targetPath = path.join(targetDir, file);
      // 判断是文件还是文件夹
      fs.stat(sourcePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }
        if (stats.isFile()) {
          // 如果是文件，则读取内容并写入目标文件
          fs.readFile(sourcePath, "utf8", (err, content) => {
            if (err) {
              console.error("Error reading file:", err);
              return;
            }
            fs.writeFile(targetPath, content, "utf8", (err) => {
              if (err) {
                console.error("Error writing file:", err);
              } else {
                console.log("File copied successfully");
              }
            });
          });
        } else if (stats.isDirectory()) {
          // 如果是文件夹，则递归处理子文件夹和文件
          copyDir(sourcePath, targetPath);
        }
      });
    });
  });
}

// 递归复制文件夹及其内容
function copyDir(sourceDir, targetDir) {
  // 创建目标文件夹
  fs.mkdir(targetDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return;
    }
    // 读取源文件夹下的所有文件和文件夹
    fs.readdir(sourceDir, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }
      // 遍历所有文件和文件夹
      files.forEach((file) => {
        // 获取源文件或文件夹的完整路径
        const sourcePath = path.join(sourceDir, file);
        // 获取目标文件或文件夹的完整路径
        const targetPath = path.join(targetDir, file);
        // 判断是文件还是文件夹
        fs.stat(sourcePath, (err, stats) => {
          if (err) {
            console.error("Error getting file stats:", err);
            return;
          }
          if (stats.isFile()) {
            // 如果是文件，则读取内容并写入目标文件
            fs.readFile(sourcePath, "utf8", (err, content) => {
              if (err) {
                console.error("Error reading file:", err);
                return;
              }
              fs.writeFile(targetPath, content, "utf8", (err) => {
                if (err) {
                  console.error("Error writing file:", err);
                } else {
                  console.log("File copied successfully");
                }
              });
            });
          } else if (stats.isDirectory()) {
            // 如果是文件夹，则递归处理子文件夹和文件
            copyDir(sourcePath, targetPath);
          }
        });
      });
    });
  });
}
