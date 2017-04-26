## MachineLabs server

This is the server powering machinelabs.ai

### Repository layout

#### `/server`

This holds the actual server.

#### `/firebase`

This holds the cloudfunctions and database security rules for firebase

#### `/scripts`

This holds a collection of scripts that aren't particulary scoped to either
the server or the firebase but rather operate on the whole system mainly
to achieve a smooth deployment.

### Running the server

#### Prerequisite

Install docker and pull down the `thoughtram/keras` images.

```
docker pull thoughtram/keras
```

**If you don't have docker you can start the server with the `--dummy-runner` flag.**

#### How To

```
git clone <this-repo-url>
cd `./server
npm install   # or yarn install
npm run serve # or npm run serve -- --dummy-runner
```

### Deployment

#### Prerequisite

1. Install and configure [`gcloud`](https://cloud.google.com/sdk/gcloud/)
2. Install and configure [`firebase-tools`](https://firebase.google.com/docs/cli/)

#### Deploying the whole system to staging (recommended)

This command needs to be run from the root level

```
./scripts/deploy_staging.sh
```

#### Deploying only the server to the staging system

This command needs to be run from the root level

```
./scripts/deploy_staging_server.sh
```

#### Deploying only the cloudfunctions and security rules to the staging firebase

This command needs to be run from the root level

```
./scripts/deploy_staging_firebase.sh
```


