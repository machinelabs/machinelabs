// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  offline: false,
  testing: false,
  // None of this is sensitive. It will be all in the public client.
  // No need to hide it from the repository
  firebaseConfig: {
    apiKey: 'AIzaSyDu0Qds2fWo8iZMcCj0T_ANqD9V4E0_9QY',
    authDomain: 'machinelabs-a73cd.firebaseapp.com',
    databaseURL: 'https://machinelabs-a73cd.firebaseio.com',
    storageBucket: 'machinelabs-a73cd.appspot.com',
    messagingSenderId: '351438476852'
  }
};
