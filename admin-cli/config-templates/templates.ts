export const templates = {
  staging: {
    server: {
      name: 'ahlem',
      zone: 'europe-west1-c',
      env: 'staging'
    },
    client: {
      env: 'staging'
    },
    firebase: {
      databaseUrl: 'https://machinelabs-a73cd.firebaseio.com',
      privateKeyEnv: 'MACHINELABS_STAGING_FB_PRIVATE_KEY',
      clientEmailEnv: 'MACHINELABS_STAGING_FB_CLIENT_EMAIL'
    },
    googleProjectId: 'machinelabs-a73cd'
  },
  staging2: {
    server: {
      name: 'list',
      zone: 'europe-west1-c',
      env: 'staging2'
    },
    client: {
      env: 'staging'
    },
    firebase: {
      databaseUrl: 'https://machinelabs-a73cd.firebaseio.com',
      privateKeyEnv: 'MACHINELABS_STAGING_FB_PRIVATE_KEY',
      clientEmailEnv: 'MACHINELABS_STAGING_FB_CLIENT_EMAIL'
    },
    googleProjectId: 'machinelabs-a73cd'
  },
  production: {
    server: {
      name: 'hainholz',
      zone: 'us-east1-d',
      env: 'production'
    },
    client: {
      env: 'production'
    },
    firebase: {
      databaseUrl: 'https://machinelabs-production.firebaseio.com',
      privateKeyEnv: 'MACHINELABS_PRODUCTION_FB_PRIVATE_KEY',
      clientEmailEnv: 'MACHINELABS_PRODUCTION_FB_CLIENT_EMAIL'
    },
    googleProjectId: 'machinelabs-production'
  },
  production2: {
    server: {
      name: 'stephanskirchen',
      zone: 'europe-west1-c',
      env: 'production2'
    },
    client: {
      env: 'production'
    },
    firebase: {
      databaseUrl: 'https://machinelabs-production.firebaseio.com',
      privateKeyEnv: 'MACHINELABS_PRODUCTION_FB_PRIVATE_KEY',
      clientEmailEnv: 'MACHINELABS_PRODUCTION_FB_CLIENT_EMAIL'
    },
    googleProjectId: 'machinelabs-production'
  }
};
