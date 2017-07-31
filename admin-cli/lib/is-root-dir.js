var fs = require('fs');

module.exports = function isRootDir () {
  return fs.existsSync('admin-cli') && fs.existsSync('server');
}
