const fs = require("fs-extra");

const path = require("path");
const FullPath = require("fullpath");
function getAllFiles(dir) {
  const fullPaths = new FullPath.Search({
    path: "/src",
    dirname: dir,
    type: "files", //optional. If you don't specified this value, by default is set with 'files'
    allFiles: true, //optional. If you don't specified this value, by default is set with false and the result was full path of files with .js and .json extension.
  });
  return fullPaths;
}

class BasePlugin {
  constructor() {}

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      // console.log('compilation',compilation);
      const keys = Object.keys(compilation).join("--");
      console.log(keys);
      const entrys = compilation.entries;
      console.log("entrys", entrys);
      // const entrysOnePath = path.join(entrys[0].context + entrys[0]._identifier.replace('multi .', ''));
      const entrysOnePath = path.join(entrys[0].context);

      const allFiles = getAllFiles(entrysOnePath, {
        isDeep: true,
        prefix: true,
      });
      console.log("allFiles", allFiles);
      fs.outputFileSync(
        "allFiles.txt",
        Array.from(allFiles)
          // .map((file) => {
          //   console.log("file", file);
          //   return path.resolve(__dirname, file.name + "." + file.subffix);
          // })
          .join("\n")
      );

      const fileDeps = Array.from(compilation.fileDependencies).filter(
        (path) => {
          console.log("path", path);
          return path.includes("src") &&  !path.includes("node_modules") ;
        }
      );
      console.log('fileDeps', fileDeps);
      fs.outputFileSync(
        "fileDeps.txt",
        fileDeps.join("\n"),
        "utf-8"
      );
      fs.outputFileSync(
        "contextDeps.txt",
        Array.from(compilation.contextDependencies)
          .filter((path) => path.includes("src"))
          .join("\n"),
        "utf-8"
      );

      callback();
    });
  }
}

module.exports = BasePlugin;
