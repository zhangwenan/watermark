const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");

const rollup = require("rollup");
const rollupBabel = require("rollup-plugin-babel");
const rollupNodeResolver = require("rollup-plugin-node-resolve");

const distDir = "./dist";

function resolveRollupTasks( dir, format, flat ) {
  let tasks = [];

  const rollupConfig = {
    plugins: []
  };
  const babelConfig = {
    babelrc: false,
    presets: [
      ["env", {"modules": false}]
    ],
    plugins: [
      "external-helpers"
    ]
  };

  if ( format === "es" ) {
    babelConfig.exclude = "node_modules/**";
  }
  else {
    rollupConfig.plugins.push(rollupNodeResolver());
  }

  rollupConfig.plugins.push(rollupBabel(babelConfig));

  fs.readdirSync(dir).forEach(current => {
    const currentPath = path.join(dir, current);

    if ( fs.statSync(currentPath).isFile() ) {
      tasks.push(rollup.rollup(Object.assign(rollupConfig, {
        input: path.join(__dirname, currentPath)
      }))
      .then(bundle => {
        let distPath = current;

        if ( flat !== true ) {
          const splitted = currentPath.split("\/");

          if ( splitted.length > 1 ) {
            distPath = splitted.slice(1).join("\/");
          }
        }

        return bundle.write({
          file: path.join(distDir, format === "es" ? "esm" : format, distPath),
          format,
          name: current
        });
      }));
    }
    else {
      tasks = tasks.concat(resolveRollupTasks(currentPath, format, flat));
    }
  });

  return tasks;
}

gulp.task("compile-js", () => {
  return Promise.all(resolveRollupTasks("build/wrappers", "umd", true).concat(resolveRollupTasks("src", "es")));
});

gulp.task("compile", ["compile-js"], function() {
  return gulp.src(`${distDir}/umd/**/*.js`)
    .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${distDir}/umd/`));
});

gulp.task("watch", function() {
  gulp.watch("./src/**/*.js", ["compile-js"]);
});

gulp.task("default", ["compile", "watch"]);
