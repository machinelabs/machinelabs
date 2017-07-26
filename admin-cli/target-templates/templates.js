module.exports = {
  ahlem: {
    serverName: 'ahlem',
    zone: 'europe-west1-c',
    // We can't use `machinelabs-staging` here because that is
    // just the project alias (which we can use for firebase) but
    // not for gcloud which needs to get the projectId
    googleProjectId: 'machinelabs-a73cd',
    env: 'staging'
  }
};