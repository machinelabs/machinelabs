# MachineLabs REST API

This API currently allows to download outputs. The staging version of the API is deployed at `https://rest-staging.ai` and the production API will get deployed at `https://rest.machinelabs.ai`.

## Usage

GET `/executions/{executionId}/outputs/{fileName}`

E.g `GET https://rest.machinelabs.ai/executions/foo/outputs/bar.txt`.

## Development

The project needs to be build with the `--env` flag explicitily. Notice that `--env=staging` and `--env=production` will only work in an environment that is natively configured to allow communication to the requested bucket. This works by default in a Google Cloud Server environment but won't work locally.

For local development, introduce a `debug` property in your `environment.personal.ts` file and set it to true.

The server will then serve files from the local directory `./mock-bucket` instead. For convenience  a file `test.txt` exists at `./mock-bucket/executions/foo/outputs/test.txt` that can be requested via `GET localhost:8080/executions/foo/outputs/test.txt`

To run the server execute:

`npm run build -- --env=personal && npm run start`

## Deployment

The REST API is deployed is integrated in the `deploy` command of the admin-cli and a `--noRest` flag exists to not include it in the deployment.

Notice that the REST API is deployed on Google App Engine.