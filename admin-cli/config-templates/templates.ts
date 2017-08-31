export const templates = {
  staging: {
    target: {
      serverName: 'ahlem',
      zone: 'europe-west1-c',
      // We can't use `machinelabs-staging` here because that is
      // just the project alias (which we can use for firebase) but
      // not for gcloud which needs to get the projectId
      googleProjectId: 'machinelabs-a73cd',
      fbDatabaseUrl: 'https://machinelabs-a73cd.firebaseio.com',
      fbPrivateKeyEnv: 'MACHINELABS_STAGING_FB_PRIVATE_KEY',
      fbClientEmailEnv: 'MACHINELABS_STAGING_FB_CLIENT_EMAIL'
    },
    env: 'staging'
  },
  staging2: {
    target: {
      serverName: 'list',
      zone: 'europe-west1-c',
      // We can't use `machinelabs-staging` here because that is
      // just the project alias (which we can use for firebase) but
      // not for gcloud which needs to get the projectId
      googleProjectId: 'machinelabs-a73cd',
      fbDatabaseUrl: 'https://machinelabs-a73cd.firebaseio.com',
      fbPrivateKeyEnv: 'MACHINELABS_STAGING_FB_PRIVATE_KEY',
      fbClientEmailEnv: 'MACHINELABS_STAGING_FB_CLIENT_EMAIL'
    },
    env: 'staging2'
  },
  production: {
    target: {
      serverName: 'hainholz',
      zone: 'us-east1-d',
      googleProjectId: 'machinelabs-production',
      fbDatabaseUrl: 'https://machinelabs-production.firebaseio.com',
      fbPrivateKeyEnv: 'MACHINELABS_PRODUCTION_FB_PRIVATE_KEY',
      fbClientEmailEnv: 'MACHINELABS_PRODUCTION_FB_CLIENT_EMAIL'
    },
    env: 'production'
  },
  production2: {
    target: {
      serverName: 'stephanskirchen',
      zone: 'europe-west1-c',
      googleProjectId: 'machinelabs-production',
      fbDatabaseUrl: 'https://machinelabs-production.firebaseio.com',
      fbPrivateKeyEnv: 'MACHINELABS_PRODUCTION_FB_PRIVATE_KEY',
      fbClientEmailEnv: 'MACHINELABS_PRODUCTION_FB_CLIENT_EMAIL'
    },
    env: 'production'
  }
};
