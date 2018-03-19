const stagingTemplate = {
  server: {
    name: 'ahlem',
    zone: 'europe-west1-c',
    env: 'staging'
  },
  client: {
    env: 'staging'
  },
  rest: {
    env: 'staging'
  },
  firebase: {
    databaseUrl: 'https://machinelabs-a73cd.firebaseio.com',
    privateKeyEnv: 'MACHINELABS_STAGING_FB_PRIVATE_KEY',
    clientEmailEnv: 'MACHINELABS_STAGING_FB_CLIENT_EMAIL'
  },
  googleProjectId: 'machinelabs-a73cd'
};

const productionTemplate = {
  server: {
    name: 'hainholz',
    zone: 'us-east1-d',
    env: 'production'
  },
  client: {
    env: 'production'
  },
  rest: {
    env: 'production'
  },
  firebase: {
    databaseUrl: 'https://machinelabs-production.firebaseio.com',
    privateKeyEnv: 'MACHINELABS_PRODUCTION_FB_PRIVATE_KEY',
    clientEmailEnv: 'MACHINELABS_PRODUCTION_FB_CLIENT_EMAIL'
  },
  googleProjectId: 'machinelabs-production'
};

export const templates = {
  staging: stagingTemplate,
  staging2: {
    ...stagingTemplate,
    ...{
      server: {
        name: 'list',
        zone: 'europe-west1-c',
        env: 'staging2'
      }
    }
  },
  'staging-portimao': {
    ...stagingTemplate,
    ...{
      server: {
        name: 'portimao',
        zone: 'us-east1-d',
        env: 'staging-portimao'
      }
    }
  },
  production: productionTemplate,
  production2: {
    ...productionTemplate,
    ...{
      server: {
        name: 'stephanskirchen',
        zone: 'europe-west1-c',
        env: 'production2'
      }
    }
  },
  'production-rijnbuurt': {
    ...productionTemplate,
    ...{
      server: {
        name: 'rijnbuurt',
        zone: 'us-east1-c',
        env: 'production-rijnbuurt'
      }
    }
  }
};
