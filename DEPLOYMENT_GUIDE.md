# Developers Guide

This guide helps you to deploy the MachineLabs system to either *staging* or the *production*.

## Table of contents


## Prerequisites

In addition to the software listed in the developer guide it is required to have the nescecary access rights for the system that one wants to deploy.

## Stages of deployment

Before we get into the nitty gritty details of the deployment, it is important to understand that every new software release should first be deployed to the staging system to be tested there.

Only after the software release has been proven to work well on staging a deployment to production should be considered. This helps to minimize the risk of shipping broken software to production. It is especially useful to uncover bugs that are directly related to the deployment of the software itself.

## Deployment targets

The MachineLabs system consists of different software components that all contribute to the overall user experience but vary in their degree of coupling between each other. These components are:

- the web app that people see at machinelabs.ai or staging.machinelabs.ai
- the server that runs the executions
- the firebase functions that perform various *very* important tasks
- the REST API which can be used to download outputs
- the CLI which is distributed via npm

All of these different components are coupled to some degree. In general, it is considered best practice to deploy all at once to avoid a situation where e.g. the web app was deployed in a version that expects a server version which was not yet deployed.

That said, there's a trade off between the overall time consumption of the deployment and the chances of human error to screw things up. In practice, that means that often we do only want to deploy a subset of the components at once. However, it is very important to understand when and how these partial deployments should be done.

In general, the server, the web app and the firebase functions have the strongest coupling and should be deployed together. Exceptions to these cases are:

1. Hotfixes for which we are 100 % sure they are safe to be deployed in isolation

2. Follow-up server deployments that follow a full deployment

### Follow-up server deployments

While our deployment process is designed to deploy all the different components in one pass, it is important to understand that there's always only one server being deployed at a time. However, in production we have multiple servers running in parallel which means we have to decide which server we first want to include in the full deployment and once done deploy only the server to the other servers that are being used.

### Rolling releases

While deploying to staging isn't that critical, more thought needs to go into production deployments. Here's why: If we deploy to a server that is currently performing executions, we'll leave the system in an inconsistent state (dangling executions).

The best way to deal with this is to do rolling releases. The procedure goes as follows:

1. Boot a spare server (Needs to be done through the Google Cloud Computing UI)

2. Deploy to that spare server **while keeping it disabled** (it won't get executions assigned while it is disabled)

3. After that server is deployed, route traffic to the new server and disable traffic for the old server. It is important to understand, that if the old server is still performing executions it will continue to do so but it won't get new executions assigned. Eventually it can be taken offline or become available for updates when all executions ended.

4. Now deploy the rest of the system (at least firebase functions + web app)

### Deployments can only be done from tags

Notice that deployments can only be done from tags. This helps to enforce proper versions being deployed as opposed to arbitrary commits that are hard to trace back if needed.

Cutting releases is simple with the `admin-cli` `cut` command. We can get some overview by running `yarn run mla cut --help` from within the `admin-cli` directory.

```
$ yarn run mla cut --help
yarn run v1.5.1
$ node ./dist/index.js cut --help
admin-cli/dist/index.js cut [<options>]

Options:
  --help     Show help                                                 [boolean]
  --major    Cuts a new major release                                  [boolean]
  --minor    Cuts a new minor release                                  [boolean]
  --patch    Cuts a new patch release                                  [boolean]
  --dev      Cuts a development pre-release                            [boolean]
  --dry-run  Does a dry run                                            [boolean]
  --version  Cuts a new release with a specified version                [string]
```

### The deployment API

The MachineLabs system is deployed using the `admin-cli`. We can get an overview of the `deploy` subcommand by running `yarn run mla deploy --help` inside of the `admin-cli` directory.

```shell
$ yarn run mla deploy --help
yarn run v1.5.1
$ node ./dist/index.js deploy --help
admin-cli/dist/index.js deploy [<options>]

Options:
  --help                 Show help                                     [boolean]
  --noServer             Flag to suppress deployment of server         [boolean]
  --noFb                 Flag to suppress deployment of firebase       [boolean]
  --noClient             Flag to suppress deployment of client         [boolean]
  --noRest               Flag to suppress deployment of Rest API         [boolean]
  --cfg.template         Preinitialize googleProjectId, serverName and zone from
                         a template configuration                       [string]
  --cfg.googleProjectId  GoogleProjectId to be used                     [string]
  --cfg.server.name      Name of server to be used                      [string]
  --cfg.server.zone      Zone of server                                 [string]
  --cfg.server.env       Environment file for server                    [string]
  --cfg.client.env       Environment file for server                    [string]
```

The different flags might feel a bit overwhelming at first but the good news is that we don't need most of them if we want to use one of the existing configuration templates which can be found at `admin-cli/config-templates/templates.ts`. For instance, there's a template called `staging` that we can use to effecively deploy the entire system to staging using just the following command.

```shell
yarn run mla deploy --cfg.template=staging
```

But keep in mind that each of these templates can only specify a single server which means that, at least for production, there is no single command to deploy the entire system at once.

By default the `deploy` command deploys all the mentioned targets (with the exception of the CLI which uses a different command) but we can limit the targets with the `--noX` flags. For instance, to deploy only the server part of the `staging` template run:

```shell
yarn run mla deploy --cfg.template=staging --noFb --noClient --noRest
```

