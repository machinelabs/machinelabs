let program = require('commander');
let pgk = require('../package.json');

import * as firebase from 'firebase';
import { environment } from './environments/environment';

firebase.initializeApp(environment.firebaseConfig);

program
  .version(pgk.version);

program
  .command('login')
  .description('Login to MachineLabs')
  .option('-g --github-token <value>', 'Login using a GitHub token')
  .action(cmd => {

    let newCredential = firebase.auth.GithubAuthProvider.credential(cmd.githubToken);
    firebase
      .auth()
      .signInWithCredential(newCredential)
      .catch((error) => console.log('There was an error during login', error))
      .then(res => console.log('Successfully logged into MachineLabs'));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}