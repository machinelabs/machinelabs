const chalk = require('chalk');

module.exports = function failWith (message) {
  console.log(chalk.red(message));
  process.exit(1);
}