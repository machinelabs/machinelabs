export const environment = {
  production: true,
  offline: false,
  // This is currently the exact same configuration we use for
  // development. We might want to change that.
  // None of this is sensitive. It will be all in the public client.
  // No need to hide it from the repository
  firebaseConfig: {
    apiKey: "AIzaSyDu0Qds2fWo8iZMcCj0T_ANqD9V4E0_9QY",
    authDomain: "machinelabs-a73cd.firebaseapp.com",
    databaseURL: "https://machinelabs-a73cd.firebaseio.com",
    storageBucket: "machinelabs-a73cd.appspot.com",
    messagingSenderId: "351438476852"
  }
};
