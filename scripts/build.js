'use strict';

const exec = require('child_process').execSync;
const glob = require('glob').sync;
const fse = require('fs-extra');
const path = require('path');

const buildConfig = require('./build.json');

// We run the Typescript Compiler from the node modules because we want to be consistent
// with the compiler version.
const TSC_BIN = './node_modules/typescript/bin/tsc';
const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_DIRECTORY = path.resolve(PROJECT_ROOT, buildConfig.outDir);

buildConfig.copyFiles.forEach(pattern => {
  let files = glob(pattern, { cwd: PROJECT_ROOT });

  files.forEach(file => {
    fse.copySync(path.join(PROJECT_ROOT, file), path.join(OUTPUT_DIRECTORY, file));
  });
});

// Retrieve all source files.
let sourceFiles = buildConfig.tsFiles
  .map(pattern => glob(pattern, { cwd: PROJECT_ROOT }))
  .reduce((array, item) => array.concat(item), []);

try {
  exec(`node ${TSC_BIN} --declaration ${sourceFiles.join(' ')} --outDir ${OUTPUT_DIRECTORY}`, {
    cwd: PROJECT_ROOT
  });

  console.log("Build: Successfully compiled the TypeScript files into ES5.");
} catch (e) {
  console.error("Error: An error occurred while compiling the TypeScript files into ES5.");
  throw e;
}
