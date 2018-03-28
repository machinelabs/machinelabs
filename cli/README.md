## MachineLabs  CLI

This is the CLI for the MachineLabs platform. This project is currently under rapid development. More commands will be added and existing commands are likely to change as we flesh things out.

### Installation

To install the CLI globally on your system either use `yarn` or `npm` as follows:

```
yarn global add @machinelabs/cli

or

npm install -g @machinelabs/cli
```

### Usage

Here's a list of currently available commands. You can alway run `ml --help` to retrieve this list.


```
Usage: ml [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    login            Login to MachineLabs
    logout           Log the CLI out from MachineLabs
    push [options]   Push current directory as a lab 
    pull [options]   Pull existing lab to your local file system
    init [options]   Initialize current directory as lab
```




## Notes for Developers of the CLI

### How to get this running locally

1. Setup your firebase cloud functions with a service account

In case you need to create a fresh service account file go to:

console.firebase.google.com > Project Settings > Service Accouts > Firebase Admin SDK

Run `npx firebase use <my-fb>` followed by `npx firebase functions:config:set fb_service_account="$(cat service-account.json)"


Where `service-account.json` looks like this:

```
{
  "private_key": "YOUR-PRIVATE-KEY",
  "client_email": "YOUR-CLIENT-EMAIL"
}
```

You'll also have to redeploy firebase for that to take into effect

2. Add `environment.personal.ts` next to `environment.staging.ts`

3. Make sure that the `mlDomain` property is set to `http://localhost:4200`

4. Build the project with `yarn run build:personal`

5. In order to make the `ml` command globally available, run `yarn global add /absolute/path/to/cli`. Here it's important that the path is absolute because a relative path like `./` doesn't work.
