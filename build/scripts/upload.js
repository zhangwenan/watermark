#!/usr/bin/env node

const path = require("path");
const exec = require("child_process").exec;

const pkg = require("../../package.json");
const libName = pkg.name.replace("@mhc/", "");

const cdn = process.argv.slice(2).shift();
const cmdStr = `b3 upload --silent=false --interactive=false --remote=mhc-fe/${libName}/${pkg.version} --${cdn === "wantu" ? "qiniu" : "wantu"}=false`;

const child = exec(cmdStr, {
    cwd: path.resolve(__dirname, "../../dist/umd"),
    maxBuffer: 5 * 1024 * 1024
  }, ( err, stdout, stderr ) => {
    if ( err ) {
      console.error(`exec error: ${err}`);
      return;
    }

    if ( stderr ) {
      console.log(`stderr: ${stderr}`);
    }
  });

child.stdout.on("data", function( data ) {
  console.log(data.toString());
});
