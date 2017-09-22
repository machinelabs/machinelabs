const fs = require('fs');
const path = require('path');

const { version } = require('../package.json');

console.log('Running pre-build script');

const versionFile = path.join(`${__dirname}/../src/environments/versions.ts`);
const source = `export const CLIENT_VERSION = '${version}';\n`;

console.log(`Updating client version to ${version}`);

fs.writeFile(versionFile, source, { flat: 'w' }, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Pre-build script done\n');

  process.exit();
});
