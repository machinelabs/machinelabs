const execSync = require('child_process').execSync;
const chalk = require('chalk');
const spawnOptions = { stdio: 'pipe' };

const factory = (options = { displayErrors: false }) => {
  return (cmd) => {
    try {
      let output = execSync(cmd, spawnOptions).toString();
      console.log(output);
      return output;
    }
    catch (e) {
      if (options.displayErrors){
        console.log(chalk.red(e)); 
      }
    }
  };
}

module.exports = factory;