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

### Working on the server

#### Prerequisite

**1. Get a firebase account**

**2. Install the firebase tools**

`npm install -g firebase-tools`

Once installed login with `firebase login`

**3. Create at least one server**

Go into your firebase and add at least one server. Add as many as you like but keep in mind that they get assigned randomly so if you have multiple registered servers, you'll need to have all of them running when you develop.

```
{
  ...,
  "servers": {
    "demo1": {
      "id": "demo1",
      "hardware_type": "economy",
      "name": "My demo server"
    }
  }
}
```

Then add a corresponding file `environment.demo1.ts` in `server/src/environments/personal`. It should look like this.

```
export const environment = {
  firebaseConfig: {
    apiKey: "<Your API Key>",
    authDomain: "your-firebase.firebaseapp.com",
    databaseURL: "https://your-firebase.firebaseio.com",
    storageBucket: "your-firebase.appspot.com",
    messagingSenderId: "<your-messaging-senderId>"
  },
  serverId: 'demo1'
};
```

You get all the firebase relevant information from their console. The `serverId` should match the id that you created in the `/servers` node of your firebase. If you created multiple server, create multiple environment files.

**3. Install docker**

Install docker and pull down the `thoughtram/keras` images.

```
docker pull thoughtram/keras
```

**If you don't have docker you can start the server with the `--dummy-runner` flag.**

#### Running the server locally

**1. Deploy the firebase security rules and cloud functions**

Switch into the `firebase` directory and deploy cloud functions and security rules with the following command. If you have privileges for `machinelabs-staging` or `machinelabs-production` make sure to always check that your are actually in your development firebase with `firebase use <my-firebase>`.

**ATTENTION: Never deploy firebase to `machinelabs-staging` or `machinelabs-production` manually. (See Deployment)**

```
cd ./firebase
firebase use <my-dev-firebase>`
firebase deploy
```

**2. Build and run the server**

```
cd ./server
gulp build --env=demo1 && node dist/index.js
```

If you have multiple servers, repeat this step to run them all in parallel.

### Deployment

#### Prerequisite

1. Install and configure [`gcloud`](https://cloud.google.com/sdk/gcloud/)
2. Install and configure [`firebase-tools`](https://firebase.google.com/docs/cli/)

#### Deploying the whole system to staging

This command needs to be run from the root level

```
./admin-cli/index.js deploy --template=ahlem
```

#### Deploying only the server to the staging system

This command needs to be run from the root level

```
./admin-cli/index.js deploy --template=ahlem --noFb
```

#### Deploying only the cloudfunctions and security rules to the staging firebase

This command needs to be run from the root level

```
./admin-cli/index.js deploy --template=ahlem --noServer
```


