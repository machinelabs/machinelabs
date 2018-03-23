# Developers Guide

This guide helps you setting up, building and running MachineLabs on your own machine.

## Table of contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Cloning the repository](#cloning-the-repository)
  - [Installing dependencies](#installing-dependencies)
    - [Installing shared dependencies](#installing-shared-dependencies)
    - [Installing server dependencies](#installing-server-dependencies)
    - [Installing firebase dependencies](#installing-firebase-dependencies)
    - [Installing client dependencies](#installing-client-dependencies)
  - [Configuring Firebase](#configuring-firebase)
    - [Creating Firebase project](#creating-firebase-project)
    - [Activating Authentication Providers](#activating-authentication-providers)
    - [Adding Docker image entries](#adding-docker-image-entries)
    - [Adding plan entries](#adding-plan-entries)
    - [Adding server entries](#adding-server-entries)
    - [Deploying Firebase rules and functions](#deploying-firebase-rules-and-functions)
    - [Adding environment files](#adding-environment-files)
  - [Setting up environment variables](#setting-up-environment-variables)
- [Running the app](#running-the-app)
  - [Running the server](#running-the-server)
  - [Running the client](#running-the-client)

## Prerequisites

- Get a [Firebase](https://firebase.google.com) account
- Install [Git](https://git-scm.com) and [NodeJS 8+](https://nodejs.org)
- Install [gcloud SDK](https://cloud.google.com/sdk/gcloud/)
- Install [Docker](https://docs.docker.com/)
- Install [Yarn](https://yarnpkg.com/en/)
- Install [Angular CLI](https://cli.angular.io)
- Install [Firebase Tools](https://github.com/firebase/firebase-tools)
- Install [Firebase Bolt Compiler](https://github.com/firebase/bolt)

## Installation

Let's install MachineLabs on your machine.

### Cloning the repository

First we need to clone the [MachineLabs repository](https://github.com/machinelabs/machinelabs):

```
$ git clone https://github.com/machinelabs/machinelabs
```

### Installing dependencies

Once cloned, we need to install all dependencies for every package of the MachineLabs project (`server`, `client`, `shared`, etc.).

#### Installing shared dependencies

For every package in `shared`, run `npx yarn install`:

```shell
$ cd shared/*
$ npx yarn install
```

#### Installing server dependencies

```shell
$ cd server
$ npx yarn install
```

#### Installing firebase dependencies

```shell
$ cd firebase/functions
$ npx yarn install
```

#### Installing client dependencies

```shell
$ cd client
$ npx yarn install
```

### Configuring Firebase

MachineLabs uses Firebase as a real-time database and expects a few specific configurations in order to function. Let's set those up:

#### Creating a Firebase project

Create a project on [firebase.google.com](https://firebase.google.com), you can name it whatever you like. However, this project is going to provide the database, authentication, function hosting etc. for your MachineLabs setup.

#### Activating Authentication providers

In order to take advantage of your firebase project's authentication features, we have to explicitly activate the authentication providers we want to support in MachineLabs. Right now, those are **GitHub** and **Anonymous**. To activate authentication providers go to **Develop -> Authentication ->  Sign-in Method**. 

#### Configuring Docker image entries

MachineLabs runs users code in docker containers. All available docker containers need to be registered in the database. For that, MachineLabs expects a `docker_images` node that has docker image nodes with the following structure:

```
"keras_v2-0-x_python_2-1" : {
  "id" : "keras_v2-0-x_python_2-1",
  "name" : "Keras 2.0.4 + Python 2.1",
  "description" : "Keras 2.0.4 and Python 2.1"
}
```

The easiest way to get hold of a list of docker images is to import the JSON file provided in `firebase/data/docker_images.json` into your firebase database. One way to import that is to use the firebase CLI like this:

```
firebase database:set /docker_images firebase/data/docker_images.json
```

However, keep in mind that MachineLabs will need to download them, so instead of registering all docker images, pick only one.

#### Adding plan entries

Available plans for users are stored in the database as well. Same as for the docker images, we have a file prepared to import all available plans in `firebase/data/plans.json`.

#### Adding server entries

MachineLabs will look for available servers to run in the database. For that we need to register at least one server entry in the database. Add as many as you like but keep in mind that they get assigned randomly so if you have multiple registered servers, you'll either need to have all of them running when you develop or use the `disabled` property in the server configuration to make sure only one server will get executions assigned.

```
{
  ...,
  "servers": {
    "demo1": {
      "id": "demo1",
      "hardware_type": "cpu",
      "name": "My demo server",
      "disabled": false
    }
  }
}
```

#### Deploying Firebase rules and functions

Next we need to deploy firebase rules so not everyone can just go ahead and write into any entries of our database. The repository comes with rules. To deploy them we first need to login to firebase using the firebase CLI:

```
$ firebase login
```

Once logged in, we can deploy the provided rules by executing:

```
$ cd firebase/functions
$ npx yarn run deploy
```

##### Recompile Firebase rules

If you make any changes to any firebase rules, they need to be recompiled before deploying them again. The database rules are written in [firebase-bolt](https://github.com/firebase/bolt), a language that makes writing complex firebase rules a bit more pleasant. 

You can recompile the database rules like so:

```
$ cd firebase
$ firebase-bolt database.rules.bolt
```

After that you simply deploy the generated `database.rules.json` using either the deploy script, or by deploying them using the firebase CLI like this:

```
$ firebase deploy --only database
```

#### Adding environment files

In order to make both, the server and the client, talk to your project's firebase, we need to create environment files respectively.

##### Server environment files

To add a new environment to the server, create a new typescript file in `server/src/environments/personal` with the schema `environment.[NAME].ts`. A good practice is to use the server name for your environments. For example, if you want to call your personal environment server `san-francisco`, you'd create a file `environment.san-francisco.ts`. All environment files added to this folder will be ignored by source control.

Inside that file, export an `environment` object that looks like this:

```ts
export const environment = {
  firebaseConfig: {
    apiKey: '...',
    authDomain: '...',
    databaseURL: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...'
  },
  serverId: '...',
  rootMountPath: '/tmp',
  slackLogging: {
    allChannel: '',
    errorChannel: ''
  }
};
```

- **firebaseConfig** - An object with your firebase configuration. You can retrieve the firebase configuration from your firebase project by going to **Project Overview -> Add Firebase to your web app**.
- **serverId** - This is the id of the server you've added in [adding server entries](#adding-server-entries).
- **rootMountPath** - A path to a location where datasets will be mounted to. Leave this as `/tmp`
- **slackLogging** - Channel names for Slack. Those can be left blank.

##### Client environment files

We can repeat the process for the client. Create a file `environment.personal.ts` in `client/src/environments`. This file is ignored by source control. Feel free to add other environment files by creating a `environment.[NAME].ts` file and adding an entry in [angular-cli.json](https://github.com/angular/angular-cli/wiki/build#build-targets-and-environment-files) accordingly.

The contents of your environment file for the client should look something like this:

```ts
export const environment = {
  production: false,
  offline: false,
  testing: false,
  restApiURL: 'localhost:8080',
  firebaseConfig: {
    apiKey: '...',
    authDomain: '...',
    databaseURL: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...'
  },
  topPicksLabIds: []
}
```

Make sure to replace the `firebaseConfig` with your own. You can retrieve the firebase configuration from your firebase project by going to **Project Overview -> Add Firebase to your web app**.

## Setting up environment variables

MachineLabs' needs two environment variables in your shell - `MACHINELABS_FB_CLIENT_EMAIL` and `MACHINELABS_FB_PRIVATE_KEY`. Those need to be exported in your environment. The values for those two environment variables can be found in firebase under **Project Overview -> Settings -> Project Settings -> Service Accounts -> Firebase Admin SDK**

You need to **Generate a private key** from there. Notice that the generated key is a huge string with line breaks, represented as `\n`. You need to replace those with actual line breaks when adding the key to your environment.

The service account email address will be shown on the same page.

## Running the app

Now that everything's set up, we can run our app locally. 

### Running the server

To run the server, navigate to the `server` folder and execute the following command:

```
$ cd server
$ npx yarn build --env=YOUR_ENV_NAME && node dist/index.js
```

This will build the server using your personal environment file and serve the resulting distribution file. You might notice that it'll also build all packages in `shared`. If you don't want it to build the shared libraries, use the `--skip-shared` option as follows:

```
$ npx yarn build --env=YOUR_ENV_NAME --skip-shared && node dist/index.js
```

### Running the client

To run the client, we use Angular CLI, as the client is an Angular app. All we have to do is navigating to the client folder and run `ng serve` with our custom environment like this:

```
$ cd client
$ ng serve --env=personal
```

**That's it!** You can now open your favourite browser at `localhost:4200` and use the app.

### Deployment

#### Deploying the whole system to staging

```
./admin-cli/index.js deploy --template=staging
```

#### Deploying only the server to the staging system

```
./admin-cli/index.js deploy --template=staging --noFb --noClient --noRest
```

#### Deploying only the cloudfunctions and security rules to the staging firebase

```
./admin-cli/index.js deploy --template=staging --noServer --noClient --noRest
```



