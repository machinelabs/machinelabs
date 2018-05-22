import Environment from 'models/environment';

export const environment: Environment = {
  firebaseConfig: {
    apiKey: 'AIzaSyDB6mmk8CDyy9D6DpYQgzLd3-wwY5WDSEc',
    authDomain: 'machinelabs-production.firebaseapp.com',
    databaseURL: 'https://machinelabs-production.firebaseio.com',
    projectId: 'machinelabs-production',
    storageBucket: 'machinelabs-production.appspot.com',
    messagingSenderId: '273257478502'
  },
  serverId: 'rijnbuurt',
  pullImages: true,
  rootMountPath: '/bucket',
  slackLogging: {
    allChannel: 'log-production-all',
    errorChannel: 'log-production-error'
  }
};
