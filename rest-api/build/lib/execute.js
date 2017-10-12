const chalk = require('chalk');
const execSync = require('child_process').execSync;

const spawnOptions = { stdio: 'inherit' };

module.exports = (options = { displayErrors: false }) => {
  return (cmd) => {
    try {
      execSync(cmd, spawnOptions);
    } catch (e) {
      if (options.displayErrors) {
        console.log(chalk.red(e));
      }
    }
  }
}