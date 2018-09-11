export default interface Environment {
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId?: string;
    storageBucket: string;
    messagingSenderId: string;
  };
  serverId: string;
  writeable?: boolean;
  pullImages?: boolean;
  rootMountPath: string;
  slackLogging?: {
    allChannel: string;
    errorChannel: string;
  };
};
