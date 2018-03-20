// The reason we have this here and not in the admin-cli is
// because the admin-cli depends on the shared libs itself what
// kinda brings us into a chicken egg situation. Notice however
// that the admin-cli has a `build-shared` command that basically
// just invokes this script as a convenience command.

const execute = require("child_process").execSync;

const doInstall = !!process.argv.includes("--install");

// packages need to be built in order (e.g core depends on models)
let buildOrder = ["models", "core", "metrics", "supervisor"];

const buildCmd = dir =>
  execute(`(cd ${dir} && ./node_modules/typescript/bin/tsc)`, {
    stdio: "inherit"
  });

const installAndBuildCmd = dir =>
  execute(`(cd ${dir} && yarn install && ./node_modules/typescript/bin/tsc)`, {
    stdio: "inherit"
  });

console.log("Building shared libs...");
buildOrder.forEach(doInstall ? installAndBuildCmd : buildCmd);
